import React, { Component } from 'react';
import PropTypes from 'prop-types';
import backIcon from '../res/galleryBackArrow.svg';

export default class SidePane extends Component {
  static propTypes = {
    rotationHome: PropTypes.number.isRequired,
    animationSpeed: PropTypes.number,
    bobbleSpeed: PropTypes.number,
    label: PropTypes.string,
  };

  static defaultProps = {
    animationSpeed: 0.75,
    bobbleSpeed: 2,
  };

  state = {
    rotationHome: this.props.rotationHome,
    rotation: this.props.rotationHome,
    isOpen: false,
    canBobble: false,
    isBobbling: false,
    isMoving: false,
    animationSpeed: this.props.animationSpeed,
    bannerBottomHide: null,
    bannerBottomDisplay: 'none',
    contentVisibilityClass: '',
  };

  paneBobble = () => {
    let {
        rotation,
        isOpen,
        isMoving,
        rotationHome,
        canBobble,
        isBobbling,
      } = this.state,
      minRotation = rotationHome - 0.5,
      maxRotation = rotationHome + 0.5,
      { bobbleSpeed } = this.props;

    if (!isOpen && !isMoving && !isBobbling && canBobble) {
      if (rotation <= rotationHome) {
        //bobble to the left

        this.setState({
          ...this.state,
          rotation: maxRotation,
          animationSpeed: bobbleSpeed,
          isBobbling: true,
        });

        setTimeout(() => {
          this.setState(
            {
              ...this.state,
              isBobbling: false,
            },
            this.paneBobble,
          );
        }, bobbleSpeed * 1000);
      } else if (rotation > rotationHome) {
        //bobble to the right

        this.setState({
          ...this.state,
          rotation: minRotation,
          animationSpeed: bobbleSpeed,
          isBobbling: true,
        });
        //call yourself after the animation finishes and you set the correct state
        setTimeout(() => {
          this.setState(
            {
              ...this.state,
              isBobbling: false,
            },
            this.paneBobble,
          );
        }, bobbleSpeed * 1000);
      }
    }
  };

  closePane = () => {
    const animationSpeed = this.props.animationSpeed;
    const rotationHome = this.props.rotationHome;

    this.setState({
      ...this.state,
      isMoving: true,
      isOpen: false,
      animationSpeed,
      bannerBottomHide: 'paneBannerBottomHide',
      contentVisibilityClass: 'paneContentClose',
    });

    setTimeout(() => {
      this.setState({
        ...this.state,
        isMoving: true,
        isOpen: false,
        rotation: rotationHome,
        bannerBottomHide: 'paneBannerBottomHide',
        animationSpeed,
      });
    }, 250);

    setTimeout(() => {
      this.setState(
        {
          ...this.state,
          rotation: rotationHome,
          isMoving: false,
          isOpen: false,
          bannerBottomDisplay: 'none',
          bannerBottomHide: 'paneBannerBottomHide',
          animationSpeed,
        },
        this.paneBobble,
      );
    }, animationSpeed * 1000 + 250);
  };

  openPane = () => {
    const animationSpeed = this.props.animationSpeed;
    this.setState({
      ...this.state,
      isOpen: true,
      isMoving: true,
      rotation: 0,
      animationSpeed,
    });

    setTimeout(() => {
      this.setState({
        ...this.state,
        isOpen: true,
        isMoving: false,
        rotation: 0,
        bannerBottomDisplay: 'block',
        bannerBottomHide: null,
        animationSpeed,
        contentVisibilityClass: 'paneContentOpen',
      });
    }, animationSpeed * 1000);
  };

  handleClick = () => {
    if (this.state.isOpen && !this.state.isMoving) {
      this.closePane();
    } else if (!this.state.isOpen && !this.state.isMoving) {
      this.openPane();
    }
  };

  toggleBobble = override => {
    let argIsDef = typeof override === 'boolean',
      { canBobble } = this.state;
    if (argIsDef) {
      this.setState({ canBobble: override });
    } else {
      this.setState({
        canBobble: !canBobble,
      });
    }
  };

  handleMouseEnter = () => {
    const state = this.state;
    if (
      !this.state.isOpen &&
      this.state.rotation < this.state.rotationHome + 8
    ) {
      this.setState({
        ...state,
        canBobble: false,
        rotation: this.state.rotation + 3,
        animationSpeed: this.props.animationSpeed / 3,
      });
    }
  };

  handleMouseLeave = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        canBobble: true,
      };
    }, this.paneBobble);
  };

  getLabel = () => (
    <div
      className="paneLabel"
      style={{
        opacity: this.state.isOpen ? '0' : '1',
      }}
    >
      {this.props.label}
    </div>
  );

  render() {
    let { contentVisibilityClass } = this.state;
    return (
      <div
        className={this.props.className}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        id={`pane${this.props.className}`}
        style={{
          transform: `rotate(${this.state.rotation}deg)`,
          transition: `transform ${this.state.animationSpeed}s ease-in-out`,
        }}
      >
        <div className="paneBackButton">
          <img className="paneBackButtonIcon" src={backIcon} alt="" />
        </div>
        <div className="paneBannerTop" />
        {this.props.label && this.getLabel()}
        <div
          className={`paneBannerBottom ${this.state.bannerBottomHide}`}
          style={{
            display: `${this.state.bannerBottomDisplay}`,
          }}
        />
        {React.cloneElement(this.props.children, { contentVisibilityClass })}
      </div>
    );
  }
}
