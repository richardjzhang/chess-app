// @flow
import React, { type Element } from 'react';

type Props = {
  query: string,
  children?: (matches: boolean) => Element<*> | null
};

type State = {
  hasMounted: boolean,
  matches: boolean
};

class Media extends React.Component<Props, State> {
  mql: ?MediaQueryList;

  state = {
    hasMounted: false,
    matches: false
  };

  componentDidMount() {
    // Check because jsdom doesn't have matchMedia
    if (window.matchMedia) {
      const mql = (this.mql = window.matchMedia(this.props.query));
      mql.addListener(this.handleMediaQueryChange);
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState(() => ({ matches: mql.matches }));
    }

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState(() => ({ hasMounted: true }));
  }

  componentWillUnmount() {
    if (this.mql == null) return;
    this.mql.removeListener(this.handleMediaQueryChange);
  }

  handleMediaQueryChange = () => {
    if (this.mql == null) return;
    this.setState({ matches: this.mql.matches });
  };

  render() {
    if (!this.props.children || !this.state.hasMounted) return null;
    return this.props.children(this.state.matches);
  }
}

export default Media;
