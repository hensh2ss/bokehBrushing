import {SelectTool, SelectToolView} from "models/tools/gestures/select_tool"
import {BoxAnnotation} from "models/annotations/box_annotation"
import * as p from "core/properties"
import {Dimensions} from "core/enums"
import {RectGeometry} from "core/geometry"
import {extend} from "core/util/object"

export interface BkEv {
  bokeh: {
    sx: number
    sy: number
  }
  srcEvent: {
    shiftKey?: boolean
    altKey?: boolean
  }
}

export class SingleBrushToolView extends SelectToolView {
    model: SingleBrushTool

    protected _original_brush_limits: [[number, number], [number, number]] | null // Limits of the original brush
    protected _brush_action: string | null // Should either be "New", "Extend", "Move"
//    protected _current_brush_limits: [[number, number], [number, number]] | null
    protected _extend_parameters: [[boolean,boolean],[boolean,boolean]] | null
    protected _previous_pan_point: [number, number] | null

    initialize(options: any): void {
        super.initialize(options)
        console.log("Construting view")
        console.log(this)
        this.connect(this.plot_view.ui_event_bus.pan, () => this._viewChanged())

    }

    _viewChanged(e): void {
        console.log("View Pan Changed", this.plot_view.state_changed.sender.initial_range_info)
//        this._clearBrush()
    }

    _clearBrush(): void {
        this._original_brush_limits = null
        this.model.overlay.update({left:null, right:null, top:null, bottom:null})
        this._do_select([null,null],[null,null],false, false)
        this._brush_action = "New"
    }

    _keyup(e): void {
        if (e.key == "Escape") {
            console.log("Escape Key was hit")
            this._clearBrush()
        } else if (e.key == "h") {
            console.log("Printing Help", this)
        } else {
            console.log("Key was hit: ",e)
        }

    }

    _click_inside_brush([sx, sy]:[number,number]) {
        console.log("clickinsidebrush: ",this._original_brush_limits)
        const [[xlo, xhi],[ylo, yhi]] = this._original_brush_limits
        const xcondition = sx >= xlo && sx <= xhi
        const ycondition = sy >= ylo && sy <= yhi
        return xcondition && ycondition
    }

    _click_expand_intended( s: [number, number], pxMargin:number) {
        const lim = this._original_brush_limits
        const overall = false
        const pars = [[false, false],[false,false]]

        for (var i = 0; i< 2; i++) {
            for (var j = 0; j<2; j++) {
                if (Math.abs(s[i] - lim[i][j]) <=pxMargin ) {
                    overall = true
                    pars[i][j] = true
                }
            }
        }
        return [overall, pars]
    }

    //Called Whenever a Brush is started
    _pan_start(e: BkEv): void {
        console.log("Pan Start Event Called")

        const {sx, sy} = e.bokeh // Coordinates of the click


        if (this._original_brush_limits == null) {
            // This is the beginning of the brush
            console.log("Starting a new Brush")
            this._brush_action = "New"
            this._original_brush_limits = [[sx,null],[sy,null]]

        }else {
            const [extend, ex_pars] = this._click_expand_intended([sx,sy],4)
            if (extend) {
                console.log("Click occured on edge of box...expanding that edge / corner")
                this._brush_action = "Extend"
                this._extend_parameters = ex_pars
            } else if (this._click_inside_brush([sx, sy])) {
                console.log("Click occured inside the brush but not on edge...moving")
                this._brush_action = "Move"
            } else {
                console.log("you clicked outside the old brush...starting a new one")
                this._brush_action = "New"
                this._original_brush_limits = [[sx,null],[sy,null]]
            }

        }

        this._previous_pan_point = [sx, sy]

    }

    _update_overlay() {
        this.model.overlay.update({left:this._original_brush_limits[0][0],
                                   right: this._original_brush_limits[0][1],
                                   top: this._original_brush_limits[1][0],
                                   bottom: this._original_brush_limits[1][1]
                                  })
    }

    _set_new_brush_limits([sx, sy]:[number,number],action:string) {
        console.log("set_new_brush_limits: values: ", [sx,sy], this._original_brush_limits)
        console.log("brush action", this._brush_action)

        if (this._brush_action == "New") {
            //Calculating the new range of the new brush
            console.log("Calculating the range of the new brush")
            if (this._original_brush_limits == null) {

                this._original_brush_limits = [[this._previous_pan_point[0],sx],
                                               [this._previous_pan_point[1],sy]]
            } else {
                this._original_brush_limits[0][1] = sx
                this._original_brush_limits[1][1] = sy
            }

        } else if ( this._brush_action == "Extend") {
            console.log("\tExtending the range of the existing brush")

            const s = [sx, sy]
            const op = this._previous_pan_point
            const ob = this._original_brush_limits

            console.log(this._extend_parameters)
            // Calculating the  new range of the existing brush
            for (var i = 0; i< 2; i++) {
                for (var j = 0; j<2; j++) {

                    if (this._extend_parameters[i][j]) {
                        console.log("\t\tset_new_brush extending:  ", i, j)
                        this._original_brush_limits[i][j] = s[i]
                    }
                }
            }

        } else {
            // Calculating the new limits of the brush based on Moving the old Brush
            console.log("\t Moving the Old Brush to a new Location")
            const diff = [ sx - this._previous_pan_point[0], sy - this._previous_pan_point[1] ]
            for (var i = 0; i< 2; i++) {
                for (var j = 0; j<2; j++) {
                    this._original_brush_limits[i][j] = this._original_brush_limits[i][j] + diff[i]
                }
            }
            this._previous_pan_point = [sx, sy]



        }
    }

    //Called everytime the mouse is moved after pan_start while button is active
    _pan(e: BkEv): void {
        console.log("\tPan Continue Event Called")

        const {sx, sy} = e.bokeh // Coordinates of the click

        this._set_new_brush_limits([sx, sy], this._brush_action)
        this._update_overlay()

        if (this.model.select_every_mousemove) {
//          const append = e.srcEvent.shiftKey || false
          console.log("Shift key: ",e.srcEvent.shiftKey, e.srcEvent.altKey)
          const [sxlim, sylim] = this._original_brush_limits
          this._do_select(sxlim, sylim, false, false)
        }


    }

    //Called when button is released
    _pan_end(e: BkEv): void {
        console.log("Ending the Pan")
        const {sx, sy} = e.bokeh
        this._set_new_brush_limits([sx,sy], this._brush_action)
        this._update_overlay()
        console.log("pan_end: originalbrushlimits", this._original_brush_limits)

        this._do_select(this._original_brush_limits[0], this._original_brush_limits[1], false, false)

    }

    _do_select([sx0, sx1]: [number, number], [sy0, sy1]: [number, number], final: boolean, append: boolean = false): void {
        const geometry: RectGeometry = {
              type: 'rect',
              sx0: sx0,
              sx1: sx1,
              sy0: sy0,
              sy1: sy1,
        }
        this._select(geometry, final, append)
    }

    _emit_callback(geometry: RectGeometry): void {
        const r = this.computed_renderers[0]
        const frame = this.plot_model.frame

        const xscale = frame.xscales[r.x_range_name]
        const yscale = frame.yscales[r.y_range_name]

        const {sx0, sx1, sy0, sy1} = geometry
        const [x0, x1] = xscale.r_invert(sx0, sx1)
        const [y0, y1] = yscale.r_invert(sy0, sy1)

        const g = extend({x0, y0, x1, y1}, geometry)
        this.model.callback.execute(this.model, {geometry: g})
    }

}


const DEFAULT_BOX_OVERLAY = () => {
  return new BoxAnnotation({
    level: "overlay",
    render_mode: "css",
    top_units: "screen",
    left_units: "screen",
    bottom_units: "screen",
    right_units: "screen",
    fill_color: {value: "lightgrey"},
    fill_alpha: {value: 0.5},
    line_color: {value: "black"},
    line_alpha: {value: 1.0},
    line_width: {value: 2},
    line_dash: {value: [4, 4]},
  })
}

export class SingleBrushTool extends SelectTool {

  dimensions: Dimensions
  select_every_mousemove: boolean
  callback: any // XXX
  overlay: BoxAnnotation


  tool_name = "Brush Select"
  icon = "bk-tool-icon-box-select"
  event_type = "pan"
  default_order = 30

  get tooltip(): string {
    return this._get_dim_tooltip(this.tool_name, this.dimensions)
  }

  //@define {source: [p.Instance]}
}

SingleBrushTool.prototype.type = "SingleBrushTool"

SingleBrushTool.prototype.default_view = SingleBrushToolView

SingleBrushTool.define({
  dimensions:             [ p.Dimensions, "both"            ],
  select_every_mousemove: [ p. Bool,    true                ],
  callback:               [ p.Instance                      ],
  overlay:                [ p.Instance, DEFAULT_BOX_OVERLAY ],
})