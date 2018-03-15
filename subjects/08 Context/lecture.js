import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import * as styles from "./styles";

////////////////////////////////////////////////////////////////////////////////
// Wrapping <TabList> also breaks (no more active styles), lets check context
// for isActive and the click handler instead of props.

class TabList extends React.Component {
  static contextTypes = {
    activeIndex: PropTypes.number,
    onActivate: PropTypes.func
  }

  render() {
    const children = React.Children.map(this.props.children, (child, index) => (
      React.cloneElement(child, {
        isActive: index === this.context.activeIndex,
        onClick: () => this.context.onActivate(index)
      })
    ))

    return <div style={styles.tabs}>{children}</div>
  }
}

class Tab extends React.Component {
  render() {
    return (
      <div
        onClick={this.props.disabled ? null : this.props.onClick}
        style={this.props.disabled ? styles.disabledTab : (
          this.props.isActive ? styles.activeTab : styles.tab
        )}
      >
        {this.props.children}
      </div>
    )
  }
}

class TabPanels extends React.Component {
  static contextTypes = {
    activeIndex: PropTypes.number
  }

  render() {
    return (
      <div style={styles.tabPanels}>
        {this.props.children[this.context.activeIndex]}
      </div>
    )
  }
}

class TabPanel extends React.Component {
  render() {
    return <div>{this.props.children}</div>
  }
}

class Tabs extends React.Component {
  static childContextTypes = {
    activeIndex: PropTypes.number,
    onActivate: PropTypes.func
  }

  getChildContext() {
    return {
      activeIndex: this.state.activeIndex,
      onActivate: index => this.setState({ activeIndex: index })
    }
  }

  state = {
    activeIndex: 0
  }

  render() {
    return <div>{this.props.children}</div>
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <Tabs>
          <div>
            <TabList>
              <Tab>Tacos</Tab>
              <Tab disabled>Burritos</Tab>
              <Tab>Coconut Korma</Tab>
            </TabList>
          </div>
          <div>
            <TabPanels>
              <TabPanel><p>Tacos are delicious</p></TabPanel>
              <TabPanel><p>Sometimes a burrito is what you really need</p></TabPanel>
              <TabPanel><p>Might be your best option</p></TabPanel>
            </TabPanels>
          </div>
        </Tabs>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))

//////////////////////////////////////////////////////////////////////////////
// It's generally good practice to use a namespace on context to avoid conflicts
// with other libraries that are also using context. For example, react-router
// uses context.router. Here, we could use context.tabs.
