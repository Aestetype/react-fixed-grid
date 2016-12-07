import React, { Component, PropTypes } from 'react';
import { DraggableCore } from 'react-draggable';
import { calcPosition, calcWH, calcXY } from './utils';

class GridItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dragging: null,
      resizing: null,
    };
  }

  onResizeHandler(handlerName) {
    return (e, data) => {
      const newSize = {};
      switch (handlerName) {
        case 'onResizeStart':
          newSize.height = data.deltaY;
          newSize.width = data.deltaX;
          this.setState({ resizing: newSize });
          break;
        case 'onResize':
          newSize.height = this.state.resizing.height + data.deltaY;
          newSize.width = this.state.resizing.width + data.deltaX;
          this.setState({ resizing: newSize });
          break;
        case 'onResizeStop':
          newSize.height = this.state.resizing.height;
          newSize.width = this.state.resizing.width;
          this.setState({ resizing: false });
          break;
        default:
          throw new Error(handlerName);
      }
      const { w, h } = calcWH(this.props, newSize);
      const { x, y } = this.props;
      this.props.onDrag(handlerName, this.props.index, x, y, w, h);
    };
  }

  onDragHandler(handlerName) {
    return (e, data) => {
      const newPosition = {};
      switch (handlerName) {
        case 'onDragStart':
          newPosition.left = data.deltaX;
          newPosition.top = data.deltaY;
          this.setState({ dragging: newPosition });
          break;
        case 'onDrag':
          newPosition.left = this.state.dragging.left + data.deltaX;
          newPosition.top = this.state.dragging.top + data.deltaY;
          this.setState({ dragging: newPosition });
          break;
        case 'onDragStop':
          newPosition.left = this.state.dragging.left;
          newPosition.top = this.state.dragging.top;
          this.setState({ dragging: false });
          break;
        default:
          throw new Error(handlerName);
      }
      const { x, y } = calcXY(this.props, newPosition);
      const { w, h } = this.props;
      this.props.onDrag(handlerName, this.props.index, x, y, w, h);
    };
  }

  getStyles({ left, top, height, width }) {
    const style = {
      position: 'absolute',
      overflow: 'hidden',
      width,
      height,
      top,
      left,
    };
    if (this.state.resizing || this.state.dragging) {
      style.background = 'green';
      style.zIndex = 999;
    }
    if (this.state.dragging) {
      style.transform = `translate(${this.state.dragging.left}px, ${this.state.dragging.top}px)`;
    }
    return style;
  }

  renderResizable(child) {
    return (
      <div><DraggableCore
        onStart={this.onResizeHandler('onResizeStart')}
        onDrag={this.onResizeHandler('onResize')}
        onStop={this.onResizeHandler('onResizeStop')}
        handle={`.${this.props.resizableClassName}`}
      >
        {child}
      </DraggableCore></div>
    );
  }

  renderDraggable(child) {
    return (
      <DraggableCore
        onStart={this.onDragHandler('onDragStart')}
        onDrag={this.onDragHandler('onDrag')}
        onStop={this.onDragHandler('onDragStop')}
        handle={`.${this.props.draggableClassName}`}
      >
        {child}
      </DraggableCore>
    );
  }

  render() {
    const {
      children, isDraggable, isResizable, className,
      x, y, w, h, rowHeight, colWidth, margin, gutter,
    } = this.props;
    const pos = calcPosition({ x, y, w, h, rowHeight, colWidth, margin, gutter }, this.state);
    const style = this.getStyles(pos);
    let child = (<div style={style} className={className}>{children}</div>);
    if (isResizable) {
      child = this.renderResizable(child);
    }
    if (isDraggable) {
      child = this.renderDraggable(child);
    }
    return child;
  }
}

GridItem.propTypes = {
  index: PropTypes.number,
  margin: PropTypes.number,
  gutter: PropTypes.number,
  className: PropTypes.string,
  draggableClassName: PropTypes.string,
  resizableClassName: PropTypes.string,
  onDrag: PropTypes.func,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  w: PropTypes.number.isRequired,
  h: PropTypes.number.isRequired,
  rowHeight: PropTypes.number,
  colWidth: PropTypes.number,
  // columns: PropTypes.number,
  // rows: PropTypes.number,
  isDraggable: PropTypes.bool,
  isResizable: PropTypes.bool,
  children: PropTypes.node,
};

GridItem.defaultProps = {
  margin: 0,
  gutter: 0,
  columns: 1,
  rows: 1,
  isDraggable: false,
  isResizable: false,
};

export default GridItem;
