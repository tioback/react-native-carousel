'use strict';

var React = require('react');
var {
  Dimensions,
  StyleSheet,
  Text,
  View,
} = require('react-native');

var TimerMixin = require('react-timer-mixin');
var CarouselPager = require('./CarouselPager');

var Carousel = React.createClass({
  mixins: [TimerMixin],

  getDefaultProps() {
    return {
      hideIndicators: false,
      indicatorColor: '#000000',
      indicatorSize: 50,
      inactiveIndicatorColor: '#999999',
      indicatorAtBottom: true,
      indicatorOffset: 250,
      indicatorText: '•',
      inactiveIndicatorText: '•',
      width: null,
      initialPage: 0,
      indicatorSpace: 25,
      animate: true,
      delay: 1000,
      loop: true,
    };
  },

  getInitialState() {
    return {
      activePage: Math.max(this.props.initialPage, 0),
    };
  },

  getWidth() {
    let { width } = this.props;
    return (width !== null) ? width : Dimensions.get('window').width;
  },

  componentDidMount() {
    let { initialPage, children, animate } = this.props;

    if (initialPage > 0) {
      this.refs.pager.scrollToPage(initialPage, false);
    }

    if (animate && children) {
        this._setUpTimer();
    }
  },

  indicatorPressed(activePage) {
    this.setState({activePage});
    this.refs.pager.scrollToPage(activePage);
  },

  renderPageIndicator() {
    let { indicatorAtBottom, indicatorOffset, hideIndicators, children, indicatorSpace, indicatorSize, indicatorColor, inactiveIndicatorColor, indicatorText, inactiveIndicatorText } = this.props;

    if (hideIndicators === true) {
      return null;
    }

    let indicators = [], position, indicatorCurrentColor,
        indicatorStyle = { [indicatorAtBottom ? "bottom" : "top"] : indicatorOffset },
        calculatedWidth = children.length * indicatorSpace;

    console.log("[blue] calculated indicator container width", calculatedWidth);
    position = {
      width: calculatedWidth,
      left: (this.getWidth() - calculatedWidth) / 2
    };
    console.log("left: ", position.left);

    for (var i = 0, l = children.length; i < l; i++) {
      if (typeof children[i] === "undefined") {
        continue;
      }

      indicatorCurrentColor = (i === this.state.activePage) ? indicatorColor : inactiveIndicatorColor;
      indicators.push(
         <Text
            style={{ fontSize: indicatorSize, textAlign: "center", color: indicatorCurrentColor }}
            key={i}
            onPress={this.indicatorPressed.bind(this, i)}
          >
             { i === this.state.activePage  ? indicatorText : inactiveIndicatorText }
          </Text>
      );
    }

    if (indicators.length === 1) {
      return null;
    }

    return (
      <View style={[styles.pageIndicator, position, indicatorStyle]}>
        {indicators}
      </View>
    );
  },

  _setUpTimer() {
     if (this.props.children.length > 1) {
         this.clearTimeout(this.timer);
         this.timer = this.setTimeout(this._animateNextPage, this.props.delay);
     }
  },

  _animateNextPage() {
    console.log("animate next page")
     var activePage = 0;
     if (this.state.activePage < this.props.children.length - 1) {
         activePage = this.state.activePage + 1;
     } else if (!this.props.loop) {
         return;
     }

     this.indicatorPressed(activePage);
     this._setUpTimer();
  },

  _onAnimationBegin() {
     this.clearTimeout(this.timer);
  },

  _onAnimationEnd(activePage) {
    this.setState({activePage});
    if (this.props.onPageChange) {
      this.props.onPageChange(activePage);
    }
  },

  render() {
    return (
      <View
        style={{ flex: 1, borderWidth: 1, borderColor: "pink" }}
        onLayout={({nativeEvent})=> console.log("[pink] carousel width", nativeEvent.layout.width)}
      >
        <CarouselPager
          ref="pager"
          width={this.getWidth()}
          contentContainerStyle={[styles.container, {borderWidth: 1, borderColor: "yellow"}]}
          onBegin={this._onAnimationBeginPage}
          onEnd={this._onAnimationEnd}
        >
          {this.props.children}
        </CarouselPager>
        {this.renderPageIndicator()}
      </View>
    );
  },

});

var styles = StyleSheet.create({
  pageIndicator: {
    position: 'absolute',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor:'transparent',
  }
});

module.exports = Carousel;
