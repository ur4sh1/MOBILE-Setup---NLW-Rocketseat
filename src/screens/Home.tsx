import { useNavigation } from "@react-navigation/native";
import { View, Text, ScrollView, Alert } from "react-native";
import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { generateDatesFromYear } from '../utils/generate-dates-from-year';
import { api } from "../lib/axios";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const weekDays = ['D','S','T','Q','Q','S','S'];
const datesFromYearStart = generateDatesFromYear();
const minimumSummaryDatesSizes = 18*5;
const amountOfDayToFill =  minimumSummaryDatesSizes - datesFromYearStart.length;

type SummaryProps =  Array<{
  id: string;
  date: string;
  amount: number;
  completed: number;
}>

export function Home() {

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<SummaryProps | null>(null);
  const { navigate } = useNavigation();

  async function fetchData() {
    console.log('fetchData');

    try {
      setLoading(true);
      const response = await api.get('/summary');
      console.log(response.data);
      setSummary(response.data);
    } catch (error) {
      Alert.alert('Ops','Não foi possível carregar!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchData();
  },[]);

  if(loading){
    return (
      <Loading />
    )
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />
      <View className="flex-row mt-6 mb-2">
        {
          weekDays.map((weekDay, i)=>(
            <Text 
            key={`${weekDay}-${i}`} 
            className="text-zinc-400 text-xl text-center mx-1" 
            style={{width: DAY_SIZE}}>
              {weekDay}
            </Text>
          ))
        }
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 100}}>
      {
        summary &&
        <View className="flex-row flex-wrap">
          {
            datesFromYearStart.map(date =>{

              const dayWithhabits = summary.find(day => {
                return dayjs(date).isSame(day.date, 'day')
              })

              return (
              <HabitDay 
                key={date.toISOString()}
                date={date}
                amountofHabits={dayWithhabits?.amount}
                amountCompleted={dayWithhabits?.completed}
                onPress={()=>navigate('habit',{date: date.toISOString()})}/>
            )})
          }
          {
            amountOfDayToFill > 0 && Array.from({length: amountOfDayToFill}).map((_, index)=>(
              <View
              key={index}
              className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
              style={{ width: DAY_SIZE, height: DAY_SIZE }}
              />
            ))
          }
        </View>
        }
      </ScrollView>
    </View>
  )
}