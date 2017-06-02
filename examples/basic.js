import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import injectSheet from 'react-jss';
import EventListener from 'react-event-listener';
import { Grid, GridItem } from '../src/index';

const styles = {
  action: {
    position: 'absolute',
    height: 30,
    width: 30,
    cursor: 'pointer',
    lineHeight: '30px',
    textAlign: 'center',
  },
  draggable: {
    top: 0,
    left: 0,
  },
  resizable: {
    right: 0,
    bottom: 0,
  },
  grid: {
    backgroundColor: '#0088B8',
  },
  gridItem: {
    backgroundColor: '#6174AF !important',
  },
  gridItemContent: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    opacity: 0.9,
  },
};

class BasicDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 1920,
      height: 1080,
      boxes: [
        { x: 0, y: 0, w: 1, h: 1 },
        { x: 1, y: 0, w: 2, h: 2 },
      ],
    };
  }

  componentDidMount() {
    this.setRatio();
  }

  onItemChange = (index, { x, y, w, h }) => {
    const boxes = this.state.boxes;
    boxes[index] = { x, y, w, h };
    this.setState({ boxes });
  }

  onWindowResize = () => {
    this.setRatio();
  }

  setRatio = () => {
    const width = window.innerWidth;
    this.setState({ width, height: width / (19 / 9) });
  }

  render() {
    const { sheet: { classes } } = this.props;
    const { boxes, width, height } = this.state;
    return (
      <div>
        <EventListener target="window" onResize={this.onWindowResize} />
        <Grid
          rows={8}
          columns={12}
          onItemChange={this.onItemChange}
          width={width}
          height={height}
          margin={10}
          gutter={5}
          showGrid
          className={classes.grid}
          placeholderClassName={classes.placeholder}
        >
          {boxes.map((box, index) =>
            <GridItem
              x={box.x} y={box.y} w={box.w} h={box.h} key={index}
              isDraggable isResizable
              className={classes.gridItem}
              draggableClassName={classes.draggable}
              resizableClassName={classes.resizable}
            >
              <div className={classes.gridItemContent}>
                <div className={classNames(classes.action, classes.draggable)}>
                  <i className="material-icons">drag_handle</i>
                </div>
                <div className={classNames(classes.action, classes.resizable)}>
                  <i className="material-icons">open_with</i>
                </div>
                Box {index}
              </div>
            </GridItem>,
          )}
        </Grid>
      </div>
    );
  }
}

BasicDemo.propTypes = {
  sheet: PropTypes.object.isRequired,
};

const StyledBasicDemo = injectSheet(styles)(BasicDemo);

ReactDOM.render(<StyledBasicDemo />, document.getElementById('demo'));
