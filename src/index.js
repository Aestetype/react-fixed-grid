import React, { Component, PropTypes } from 'react';
import injectSheet from 'react-jss';
import classNames from 'classnames';
import GridItem from './grid-item';

const styles = {
  root: {
    backgroundColor: '#eee',
    height: 700,
    width: 1600,
  },
  placeholder: {
    backgroundColor: 'yellow',
    opacity: '0.7',
    transition: 'all 0.4s',
  },
  placeholderInvalid: {
    backgroundColor: 'red',
  },
  gridItem: {
    backgroundColor: 'black',
    color: 'white',
    transition: 'all 0.05s',
  },
  gridItemDefault: {
    backgroundColor: 'white',
  },
};

class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholder: null,
    };
  }

  onDrag = (handlerName, index, x, y, w, h) => {
    switch (handlerName) {
      case 'onDragStart':
      case 'onDrag':
      case 'onResizeStart':
      case 'onResize':
        this.setState({ placeholder: { x, y, w, h } });
        break;
      case 'onDragStop':
      case 'onResizeStop':
        if (this.props.onItemChange) {
          this.props.onItemChange(index, { x, y, w, h });
        }
        this.setState({ placeholder: null });
        break;
      default:
        throw new Error(handlerName);
    }
  }

  renderPlaceholder(rowHeight, colWidth) {
    const { sheet: { classes }, columns, rows, margin, gutter } = this.props;
    const { placeholder } = this.state;
    if (!placeholder) return null;
    return (
      <GridItem
        className={classNames(classes.placeholder, {
          [classes.placeholderInvalid]: placeholder.invalid,
        })}
        columns={columns} rows={rows}
        rowHeight={rowHeight} colWidth={colWidth}
        margin={margin} gutter={gutter}
        x={placeholder.x} y={placeholder.y}
        w={placeholder.w} h={placeholder.h}
      />
    );
  }

  renderGrid({ rowHeight, colWidth }) {
    const { sheet: { classes }, rows, columns, margin, gutter } = this.props;
    const grid = [];
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < columns; col += 1) {
        grid.push(<GridItem
          key={`${row}-${col}`}
          className={classNames(classes.gridItemDefault)}
          columns={columns} rows={rows}
          rowHeight={rowHeight} colWidth={colWidth}
          margin={margin} gutter={gutter}
          x={row} y={col}
          w={1} h={1}
          type="default"
        />);
      }
    }
    return grid;
  }

  render() {
    const { sheet: { classes }, children, margin, gutter,
      rows, columns, height, width } = this.props;

    const rowGuttersSum = gutter * (rows - 1);
    const rowColumnsSum = height - rowGuttersSum - (2 * margin);
    const rowHeight = rowColumnsSum / rows;

    const colGuttersSum = gutter * (columns - 1);
    const columnsSum = width - colGuttersSum - (2 * margin);
    const colWidth = columnsSum / columns;

    return (
      <div className={classes.root}>
        {this.renderGrid({ rowHeight, colWidth })}
        {children.map((child, index) => React.cloneElement(child, {
          index,
          margin,
          gutter,
          rows,
          columns,
          rowHeight,
          colWidth,
          className: classes.gridItem,
          onDrag: this.onDrag,
        }))}
        {this.renderPlaceholder(rowHeight, colWidth)}
      </div>
    );
  }
}

Grid.propTypes = {
  // Gutter size between GridItem
  gutter: PropTypes.number,
  // Global margin of Grid
  margin: PropTypes.number,
  // Number of rows of the Grid
  rows: PropTypes.number.isRequired,
  // Number of columns of the Grid
  columns: PropTypes.number.isRequired,
  // Width of the Grid
  width: PropTypes.number.isRequired,
  // Height of the Grid
  height: PropTypes.number.isRequired,
  // Children in grid
  children: PropTypes.node,
  sheet: PropTypes.object.isRequired,
  // Function called when a item change in the grid
  onItemChange: PropTypes.func,
};

Grid.defaultProps = {
  gutter: 0,
  margin: 0,
};

export default injectSheet(styles)(Grid);
