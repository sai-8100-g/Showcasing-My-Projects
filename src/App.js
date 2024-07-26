import {Component} from 'react'
import Loader from 'react-loader-spinner'

import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const status = {
  progress: 'PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class App extends Component {
  state = {
    projectsData: [],
    renderStatus: 'INITIAL',
    selectInput: categoriesList[0].id,
  }

  componentDidMount() {
    this.getProjectsList()
  }

  getProjectsList = async () => {
    this.setState({renderStatus: status.progress})
    const {selectInput} = this.state
    const response = await fetch(
      `https://apis.ccbp.in/ps/projects?category=${selectInput}`,
    )
    const data = await response.json()
    if (response.ok) {
      const updatedData = data.projects.map(eachObj => ({
        id: eachObj.id,
        name: eachObj.name,
        imageUrl: eachObj.image_url,
      }))
      this.setState({projectsData: updatedData, renderStatus: status.success})
    } else {
      this.setState({renderStatus: status.failure})
    }
  }

  renderProgress = () => (
    <div className="loader" data-testid="loader">
      <Loader type="ThreeDots" color="" height={50} width={50} />
    </div>
  )

  retryFetch = () => {
    this.getProjectsList()
  }

  renderFailure = () => (
    <div className="failureContainer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.retryFetch}>
        Retry
      </button>
    </div>
  )

  renderSuccess = () => {
    const {projectsData} = this.state

    return (
      <ul className="projectsUl">
        {projectsData.map(eachObj => {
          const {name, imageUrl} = eachObj
          return (
            <li className="projectsListItem" key={eachObj.id}>
              <img src={imageUrl} alt={name} />
              <p>{name}</p>
            </li>
          )
        })}
      </ul>
    )
  }

  onChangeOption = event => {
    this.setState({selectInput: event.target.value}, this.getProjectsList)
  }

  renderSelectDropDownList = () => {
    const {selectInput} = this.state
    return (
      <select
        className="selectInput"
        value={selectInput}
        onChange={this.onChangeOption}
      >
        {categoriesList.map(eachObj => {
          const {id, displayText} = eachObj
          return (
            <option key={id} value={id}>
              {displayText}
            </option>
          )
        })}
      </select>
    )
  }

  renderRenderStatus = () => {
    const {renderStatus} = this.state
    switch (renderStatus) {
      case status.failure:
        return this.renderFailure()
      case status.success:
        return this.renderSuccess()
      case status.progress:
        return this.renderProgress()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="mainContainer">
        <nav>
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </nav>
        <div className="selectContainer">{this.renderSelectDropDownList()}</div>
        {this.renderRenderStatus()}
      </div>
    )
  }
}

export default App
