import React from 'react'
import { View, Text } from 'react-native'

const CohortCard = (props) => {
  return (
    <View className="bg-white hover:ring shadow m-2 rounded-lg">
      <Text className="text-slate-600 text-lg font-bold border-b-slate-300 border-b p-4">{props.item.name}</Text>
      <View className="flex-1 mt-2 px-4">
        <Text className="text-slate-500 text-sm font-medium"># Candidates</Text>
        <Text className="text-slate-600 text-md font-medium">{props.item.noOfCandidates}</Text>
      </View>
      <View className="flex-1 px-4 pb-4">
        <Text className="text-slate-500 text-sm font-medium"># Assessment</Text>
        <Text className="text-slate-600 text-md font-medium">{props.item.noOfAssessments}</Text>
      </View>
      
    </View>
  )
}

export default CohortCard