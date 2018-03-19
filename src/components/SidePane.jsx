import React, { Component } from 'react'

export default class SidePane extends Component{

  constructor(props){
    super(props)
    this.state={
      rotationHome: props.rotationHome,
      rotation: props.rotationHome,
      isOpen: false,
      canBobble: false,
      isBobbling: false,
      isMoving: false,
      animationSpeed: props.animationSpeed,
      bannerBottomHide: null,
      bannerBottomDisplay: 'none',
      rotationTarget: props.rotationHome,
    }
  }

paneBobble = () => {
  let {rotation,
       isOpen,
       isMoving,
       rotationHome,
       animationSpeed,
       canBobble,
       isBobbling} = this.state,
      minRotation = rotationHome - 0.5,
      maxRotation = rotationHome + 0.5,
      newBobbling = isBobbling,
      {bobbleSpeed} = this.props

  if(rotation <= rotationHome && !isOpen && !isMoving && !isBobbling && canBobble){
    //bobble to the left
    newBobbling = true

    this.setState({
      ...this.state,
      rotation: maxRotation,
      animationSpeed: bobbleSpeed,
      isBobbling: true,
    })

    setTimeout(() => {
      this.setState(
        {
          ...this.state,
          isBobbling: false,
        },
      this.paneBobble)
    },bobbleSpeed*1000)

  } else if(rotation > rotationHome && !isOpen && !isMoving && !isBobbling && canBobble){
    //bobble to the right
    newBobbling = true

    this.setState(
      {
        ...this.state,
        rotation: minRotation,
        animationSpeed: bobbleSpeed,
        isBobbling: true,
      }
    )

    setTimeout(() => {
      this.setState(
        {
          ...this.state,
          isBobbling: false,
        },
      this.paneBobble)
    },bobbleSpeed*1000)
  }
}

closePane = () => {
  const animationSpeed = this.props.animationSpeed
  const rotationHome = this.props.rotationHome

  this.setState({
    ...this.state,
    isMoving: true,
    isOpen: false,
    animationSpeed,
    bannerBottomHide: 'paneBannerBottomHide',
  })

  setTimeout(() => {
    this.setState({
    ...this.state,
    isMoving: true,
    isOpen: false,
    rotation: rotationHome,
    bannerBottomHide: 'paneBannerBottomHide',
    animationSpeed,
    })
  }, 250)

  setTimeout(() => {
    this.setState({
      ...this.state,
      rotation: rotationHome,
      isMoving: false,
      isOpen: false,
      bannerBottomDisplay: 'none',
      bannerBottomHide: 'paneBannerBottomHide',
      animationSpeed,
    },this.paneBobble)
  }, animationSpeed*1000+250)
}

openPane = () => {
  const animationSpeed = this.props.animationSpeed
  this.setState({
    ...this.state,
    isOpen: true,
    isMoving: true,
    rotation: 0,
    animationSpeed,
  })

  setTimeout(() => {
    this.setState({
      ...this.state,
      isOpen: true,
      isMoving: false,
      rotation: 0,
      bannerBottomDisplay: 'block',
      bannerBottomHide: null,
      animationSpeed,

    })
  }, animationSpeed*1000)
}

handleClick = () => {
  if(this.state.isOpen && !this.state.isMoving){
    this.closePane()
  } else if (!this.state.isOpen && !this.state.isMoving){
    this.openPane()
  }
}

toggleBobble = (override) => {
  let argIsDef = (typeof(override) === 'boolean'),
      {isMoving, canBobble} = this.state

  if(argIsDef){
    this.setState({canBobble: override})
  }
  else{
    this.setState({canBobble: !canBobble})
  }
}

handleMouseEnter = () => {
  const state = this.state
  if(!this.state.isOpen && this.state.rotation < this.state.rotationHome + 8){
    this.setState({
      ...state,
      canBobble: false,
      rotation: this.state.rotation+3,
      animationSpeed: this.props.animationSpeed/3,
    })
  }
}

handleMouseLeave = () => {
  this.setState((prevState) => {
    return {
      ...prevState,
      canBobble: true,
    }
  },this.paneBobble)
}

  render(){
    return(
      <div
        className={this.props.className}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        id={`pane${this.props.className}`}
        style={{
          transform: `rotate(${this.state.rotation}deg)`,
          transition: `transform ${this.state.animationSpeed}s ease-in-out`
        }}>

        <div className="paneBannerTop"/>


        <div
          className="paneLable"
          style={{
            opacity: this.state.isOpen ? '0' : '1'
          }}>

          {this.props.lable}

        </div>

        <div
          className={`paneBannerBottom ${this.state.bannerBottomHide}`}
          style={{
            display: `${this.state.bannerBottomDisplay}`
          }}/>

        <div className="paneContent">
          {this.props.children}
        </div>
      </div>
    )
  }
}
