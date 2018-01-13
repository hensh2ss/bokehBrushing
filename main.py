# from bokeh.core.properties import Instance, List, String, Bool, Enum
# from bokeh.core.enums import Dimensions
# from bokeh.models.renderers import Renderer
# from bokeh.models.callbacks import Callback
# from bokeh.models.annotations import BoxAnnotation
from bokeh.models import Column
from bokeh.models import ColumnDataSource
from bokeh.plotting import figure
from bokeh.io import curdoc
import numpy as np
from extensions.brush import SingleBrushTool
from bokeh.models.tools import PanTool

xdata = np.arange(-180, 180, 0.1)*np.pi / 180.
ydata = np.sin(xdata)
zdata = np.cos(xdata)
source = ColumnDataSource(data=dict(x=xdata, y=ydata, z=zdata))

# Single Brush Example
p = figure(plot_width=600, plot_height=400,tools=[SingleBrushTool(),PanTool()], output_backend="webgl")
p.title.text ="Example of using a single brush"
p.circle('x', 'y', source=source, selection_color='orange')


# Multi Brush Example
p2 = figure(plot_width=600, plot_height=400, tools=[SingleBrushTool(),PanTool()], output_backend="webgl", x_range=p.x_range)
p2.title.text ="Example of using a multi brush"
p2.circle('x', 'z', source=source, selection_color='orange')
curdoc().add_root(Column(p, p2))
# show(plot)