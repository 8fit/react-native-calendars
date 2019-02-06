import React, {Component} from 'react';
import {
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import PropTypes from 'prop-types';

import styleConstructor from './style';

class Day extends Component {
  static propTypes = {
    // TODO: disabled props should be removed
    state: PropTypes.oneOf(['disabled', 'today', 'future', '']),

    // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
    marking: PropTypes.any,
    onPress: PropTypes.func,
    date: PropTypes.object,
    showIndicator: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.onDayPress = this.onDayPress.bind(this);
  }

  onDayPress() {
    this.props.onPress(this.props.date);
  }

  shouldComponentUpdate(nextProps) {
    const changed = ['state', 'children', 'marking', 'onPress'].reduce((prev, next) => {
      if (prev) {
        return prev;
      } else if (nextProps[next] !== this.props[next]) {
        return next;
      }
      return prev;
    }, false);
    if (changed === 'marking') {
      let markingChanged = false;
      if (this.props.marking && nextProps.marking) {
        markingChanged = (!(
          this.props.marking.marking === nextProps.marking.marking
          && this.props.marking.selected === nextProps.marking.selected
          && this.props.marking.disabled === nextProps.marking.disabled
          && this.props.marking.dots === nextProps.marking.dots));
      } else {
        markingChanged = true;
      }
      // console.log('marking changed', markingChanged);
      return markingChanged;
    } else {
      // console.log('changed', changed);
      return !!changed;
    }
  }

  renderDots(marking) {
    const loadingLegend = [this.props.showIndicator ? this.style.loadingLegend : {}];
    if (this.props.state === 'future') {
      return <View style={[this.style.futureDayLegend, loadingLegend]} />;
    }
    if (marking.dots && Array.isArray(marking.dots) && marking.dots.length > 0) {
      if (marking.dots.length === 1) {
        const { type } = marking.dots[0];
        return <View key={type} style={this.style[`${type}OnlyLegend`]}/>;
      }
      return [<View key='meal' style={this.style.mealHalfLegend}/>, <View key='workout' style={this.style.workoutHalfLegend}/>];
    }
    return <View style={[this.style.noActivityLegend, loadingLegend]} />;
  }

  render() {
    const containerStyle = [this.style.base];
    const textStyle = [this.style.text];
    const textPillStyle = [this.style.pill];
    const loadingLegend = [this.props.showIndicator ? this.style.loadingLegend : {}];

    const marking = this.props.marking || {};
    const dot = this.renderDots(marking);

    if (marking.selected) {
      containerStyle.push(this.style.selected);
      textStyle.push(this.style.selectedText);
    } else if (typeof marking.disabled !== 'undefined' ? marking.disabled : this.props.state === 'disabled') {
      textStyle.push(this.style.disabledText);
    } else if (this.props.state === 'today') {
      textStyle.push(this.style.todayText);
      textPillStyle.push(this.style.todayPill);
    }
    return (
      <TouchableOpacity disabled style={containerStyle} onPress={this.onDayPress}>
        <View style={[textPillStyle, loadingLegend]}><Text allowFontScaling={false} style={textStyle}>{String(this.props.children)}</Text></View>
        <View style={this.style.legendContainer}>
          <View style={{flexDirection: 'column'}}>{dot}</View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default Day;