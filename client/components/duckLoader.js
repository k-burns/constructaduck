import React from 'react'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { createDuck } from '../store'
import { connect } from 'react-redux'
import loader from './3dLoaderFunc'

class DuckLoader extends React.Component {
  constructor(props) {
    super(props)
    this.state = { name: '', colorPicker: '#fafafa',  isSubmitted: false }
    this.scene = new THREE.Scene()
    this.objLoader = new OBJLoader()
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.saveDuck = this.saveDuck.bind(this)
  }

  componentDidMount() {
    loader(this.state.colorPicker, this.scene, this.objLoader)
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value })
  }

  handleSubmit(evt) {
    //reload scene using color choosen
    evt.preventDefault()
    const color = this.state.colorPicker
    let scene = this.scene
    this.objLoader.load('./duck.obj', function (object) {
      object.traverse(function (child) {
        if (child.isMesh) {
          const oldMat = child.material

          child.material = new THREE.MeshPhongMaterial({
            color: color,
            map: oldMat.map
          })
        }
      })
      scene.add(object)
    })
  }
  saveDuck(evt) {
    evt.preventDefault()
    if (this.props.id === undefined) {
      window.alert('Please login to save duck')
    } else if (this.state.name === '') {
      window.alert('Please name your friend')
    } else {
      this.props.addDuck(
        this.state.name,
        this.state.colorPicker,
        this.props.id
      )
      this.setState({ isSubmitted: true })
    }
  }
  render() {
    return (
      <div className='construct-container'>
        <div className='canvas-container'>
          <canvas id='c'></canvas>
        </div>
        <div className='picker-container'>
          <div ref={(ref) => (this.mount = ref)} />
          <form onSubmit={this.handleSubmit}>
            <label htmlFor='colorPicker'>Pick your color!</label>
            <input
              type='color'
              name='colorPicker'
              onChange={this.handleChange}
            />
            <button>Try</button>
          </form>
          <form onSubmit={this.saveDuck}>
            <label htmlFor='name'>Save my Duck</label>
            <input type='text' name='name' onChange={this.handleChange} />
            <button>Save</button>
          </form>
          {/* loads after duck is saved */}
          <div>{this.state.isSubmitted && <div>Friend Sent To Nest!</div>}</div>
        </div>
      </div>
    )
  }
}

const mapState = (state) => ({
  id: state.user.id
})
const mapDispatch = (dispatch) => ({
  addDuck: (duckName, duckColor, userId) =>
    dispatch(createDuck(duckName, duckColor, userId))
})

export default connect(mapState, mapDispatch)(DuckLoader)
