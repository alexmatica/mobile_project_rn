import React from 'react';
import {StackNavigator} from "react-navigation";
import MainScreen from "./MainScreen";
import BestDestinations from "./BestDestinations";
import EditDetails from "./EditDetails";

const SimpleNavi = StackNavigator({
  Home: {screen: MainScreen},
  Destinations: {screen: BestDestinations},
  Edit: {screen: EditDetails},
});

export default class App extends React.Component {
  render(){
      return <SimpleNavi/>;
  }
}