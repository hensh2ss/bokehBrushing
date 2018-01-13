Example of D3.js style brushing for Bokeh
=========================================
This is a small example of a Bokeh extension that extends the SelectTool in order to have 
smoother brushing behavior akin to the D3.js brush, see: [here](https://bl.ocks.org/mbostock/34f08d5e11952a80609169b7917d4172)

There are two extension modules contained within, [SingleBrush.py](./SingleBrush.py) and [Multibrush.py](./MultiBrush.py).  
Both are implemented in [main.py](./main.py)

To Run:
```bash
cd [repo_location]
bokeh serve --show .

```
You can also navigate to ```localhost:5006``` on your browser to see the example.



# Requirements
This example is based upon Bokeh 0.12.13, utilizes the bokeh server (for more information see: [Running a Bokeh Server](https://bokeh.pydata.org/en/latest/docs/user_guide/server.html_)), 
and extends the SelectTool (see: [Extending Bokeh](https://bokeh.pydata.org/en/latest/docs/user_guide/extensions.html_)).

Note: The bokeh complier requires node.js greater than 6.10.0.
