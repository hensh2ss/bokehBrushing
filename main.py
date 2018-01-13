# from bokeh.core.properties import Instance, List, String, Bool, Enum
# from bokeh.core.enums import Dimensions
# from bokeh.models.renderers import Renderer
# from bokeh.models.callbacks import Callback
# from bokeh.models.annotations import BoxAnnotation

from bokeh.models import ColumnDataSource
from bokeh.plotting import figure
from bokeh.io import curdoc
import numpy as np
from extensions.brush import BrushSelectTool

def selectionChanged(attrname, old, new):
    print 'The Selection has changed'

xdata = np.arange(-180, 180, 0.1)*np.pi / 180.
ydata = np.sin(xdata)
source = ColumnDataSource(data=dict(x=xdata, y=ydata))

source.on_change('selected', selectionChanged)

# plot = figure(x_range=(0,10), y_range=(0,10), tools=[BrushSelectTool(source=source)])
# plot = figure()
plot = figure(tools=[BrushSelectTool()], output_backend="webgl")
plot.title.text ="Drag to draw on the plot"
plot.circle('x', 'y', source=source, selection_color='orange')

curdoc().add_root(plot)
# show(plot)