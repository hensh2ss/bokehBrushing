from bokeh.core.properties import Instance, List, String, Bool, Enum
from bokeh.core.enums import Dimensions
from bokeh.models.renderers import Renderer
from bokeh.models.callbacks import Callback
from bokeh.models.annotations import BoxAnnotation

from bokeh.models import ColumnDataSource, Tool, Drag
from bokeh.plotting import figure
from bokeh.io import curdoc
import numpy as np



DEFAULT_BOX_OVERLAY = lambda: BoxAnnotation(
    level="overlay",
    render_mode="css",
    top_units="screen",
    left_units="screen",
    bottom_units="screen",
    right_units="screen",
    fill_color="lightgrey",
    fill_alpha=0.5,
    line_color="black",
    line_alpha=1.0,
    line_width=2,
    line_dash=[4, 4]
)


class SingleBrushTool(Drag):
    __implementation__ = "singleBrushTool.ts"
    # source = Instance(ColumnDataSource)
    # plot = Instance(figure)

    names = List(String, help="""
    A list of names to query for. If set, only renderers that
    have a matching value for their ``name`` attribute will be used.
    """)

    renderers = List(Instance(Renderer), help="""
    An explicit list of renderers to hit test again. If unset,
    defaults to all renderers on a plot.
    """)

    select_every_mousemove = Bool(False, help="""
    Whether a selection computation should happen on every mouse
    event, or only once, when the selection region is completed. Default: False
    """)

    dimensions = Enum(Dimensions, default="both", help="""
    Which dimensions the box selection is to be free in. By default,
    users may freely draw selections boxes with any dimensions. If only
    "width" is supplied, the box will be constrained to span the entire
    vertical space of the plot, only the horizontal dimension can be
    controlled. If only "height" is supplied, the box will be constrained
    to span the entire horizontal space of the plot, and the vertical
    dimension can be controlled.
    """)

    callback = Instance(Callback, help="""
    A callback to run in the browser on completion of drawing a selection box.
    The cb_data parameter that is available to the Callback code will contain
    one BoxSelectTool-specific field:
    :geometry: object containing the coordinates of the selection box
    """)

    overlay = Instance(BoxAnnotation, default=DEFAULT_BOX_OVERLAY, help="""
    A shaded annotation drawn to indicate the selection region.
    """)

class MultiBrushTool(Drag):
    __implementation__ = "singleBrushTool.ts"
    # source = Instance(ColumnDataSource)
    # plot = Instance(figure)

    names = List(String, help="""
    A list of names to query for. If set, only renderers that
    have a matching value for their ``name`` attribute will be used.
    """)

    renderers = List(Instance(Renderer), help="""
    An explicit list of renderers to hit test again. If unset,
    defaults to all renderers on a plot.
    """)

    select_every_mousemove = Bool(False, help="""
    Whether a selection computation should happen on every mouse
    event, or only once, when the selection region is completed. Default: False
    """)

    dimensions = Enum(Dimensions, default="both", help="""
    Which dimensions the box selection is to be free in. By default,
    users may freely draw selections boxes with any dimensions. If only
    "width" is supplied, the box will be constrained to span the entire
    vertical space of the plot, only the horizontal dimension can be
    controlled. If only "height" is supplied, the box will be constrained
    to span the entire horizontal space of the plot, and the vertical
    dimension can be controlled.
    """)

    callback = Instance(Callback, help="""
    A callback to run in the browser on completion of drawing a selection box.
    The cb_data parameter that is available to the Callback code will contain
    one BoxSelectTool-specific field:
    :geometry: object containing the coordinates of the selection box
    """)

    overlay = Instance(BoxAnnotation, default=DEFAULT_BOX_OVERLAY, help="""
    A shaded annotation drawn to indicate the selection region.
    """)
