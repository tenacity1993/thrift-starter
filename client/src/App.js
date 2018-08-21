import React, {Component} from 'react'
import './App.css'

const postDataUrl = 'http://localhost:3001'
const getDataUrl = 'http://localhost:3001/getlist'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      infoList: []
    }
  }

  postData(url, param) {
    return fetch(url, {
      body: JSON.stringify(param),
      cache: 'no-cache',
      headers: {
        'Accept': 'application/json',
        'content-type': 'application/json'
      },
      method: 'POST',
      mode: 'cors'
    }).then(response => response.json())
        .then((data) => {
          console.log('data', data)
          this.setState({
            infoList: data.dataList
          }, () => {
            console.log(this.state.infoList)
          })
        })
  }

  getData(url) {
    return fetch(url).then((response) => response.json())
        .then((data) => {
          console.log('data: ', data)
          this.setState({
            infoList: data.dataList
          }, () => {
            console.log(this.state.infoList)
          })
        })
  }


  componentWillMount() {
    // 组件挂载之前请求数据
    this.getData(getDataUrl)
    console.log(this.state.infoList)
  }

  componentDidMount() {
  }


  submitInfo() {
    let name = this.refs.name.value
    let age = this.refs.age.value
    let item = {name, age}
    this.postData(postDataUrl, item)
  }

  render() {
    const list = this.state.infoList
    return (
        <div className="App">
          <div className="info-input">
            <div className="item">
              <label htmlFor="name">姓名：</label>
              <input type="text" id="name" ref="name"/>
            </div>
            <div className="item">
              <label htmlFor="age">年龄：</label>
              <input type="number" id="age" ref="age"/>
            </div>
          </div>
          <button className="submit" onClick={this.submitInfo.bind(this)}>确定</button>
          <div className="info-show">
            <h2>信息列表</h2>
            {
              list.map((item, index) => (
                  <div key={index}>{index + 1}. {item.name}：{item.age}岁</div>
              ))
            }
          </div>
        </div>
    )
  }
}

export default App
