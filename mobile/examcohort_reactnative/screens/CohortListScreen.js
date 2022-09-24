import React, { useState } from 'react'
import { View, Text, Image, FlatList, ScrollView } from 'react-native'

// Redux
import { useSelector } from 'react-redux';

// Icons
import { Bars3Icon } from "react-native-heroicons/solid";

// Decode
import decode from 'jwt-decode'

// Components
import CohortCard from '../components/CohortCard'

const dummyData = [
  {
    id: 0,
    name: "CSE327",
    noOfCandidates: 1,
    noOfAssessments: 2
  },
  {
    id: 1,
    name: "EEE141",
    noOfCandidates: 3,
    noOfAssessments: 4
  },
  {
    id: 3,
    name: "EEE141L",
    noOfCandidates: 5,
    noOfAssessments: 6
  },
  {
    id: 4,
    name: "CSE115",
    noOfCandidates: 7,
    noOfAssessments: 8
  },
  {
    id: 5,
    name: "CSE173",
    noOfCandidates: 9,
    noOfAssessments: 0
  },
]

const CohortListScreen = ({ navigation }) => {
  const currentUser = useSelector(store => store.currentUser.value)
  const [refreshing, setRefreshing] = useState(false)
  const [listData, setListData] = useState(dummyData)

  const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  const fetchData = async () => {
    setRefreshing(true)

    // Api call
    await timeout(5000)
    console.log("slept for 5 sec");
    setListData([
      {
        id: 5,
        name: "CSE173",
        noOfCandidates: 9,
        noOfAssessments: 0
      }
    ])
    // setListData(dummyData)

    setRefreshing(false)
  }

  return (
    <>
      <View className="flex-row items-center justify-between px-4 py-4 bg-flat_darkgreen2">
        <Bars3Icon color="white" fill="white" size={35} />
        <Text className="font-medium text-white text-2xl">Exam Cohorts</Text>
        <Image
          className="h-8 w-8 rounded-full"
          source={{
            uri: decode(currentUser).picture,
          }}
        />
      </View>

      <FlatList
        data={listData}
        renderItem={CohortCard}
        keyExtractor={item => item.id}
        onRefresh={fetchData}
        refreshing={refreshing}
      />

    </>
  )
}

export default CohortListScreen