import { useState } from "react";
import { Alert } from "react-native";
import { ScrollView, View, Text, TextInput, TouchableOpacity } from "react-native";
import { BackButton } from "../components/BackButton";
import { CheckBox } from "../components/CheckBox";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";
import { api } from "../lib/axios";

const availableWeekDays = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];

export function New() {

  const [title, setTitle] = useState('');

  const [weekDays, setWeekDay] = useState<number[]>([]);

  function handleToggleWeekDay(weekDayIndex: number){
    if(weekDays.includes(weekDayIndex)){
      setWeekDay(prevState => prevState.filter(weekDay => weekDay !== weekDayIndex))
    }else{
      setWeekDay(prevState => [...prevState, weekDayIndex]);
    }
  }

  async function handleCreateNewHabit() {
    try {
      if(!title.trim() || weekDays.length === 0){
        if(!title.trim()){
          Alert.alert('Título do hábito','Nome vazio!');
        }else{
          Alert.alert('Recorrência','Selecione pelo menos um dia!');
        }
      }

      await api.post('/habits',{title,weekDays}); 

      setTitle('');
      setWeekDay([]);

      Alert.alert('Novo Hábito','Registrado com sucesso!')

    } catch (error) {
      console.log(error);
      Alert.alert('Ops','Não foi possível criar um novo hábito!')
    }
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:100}}>
        <BackButton />

        <Text className="mt-6 text-white font-extrabold text-3xl">
          Criar hábito
        </Text>
        <Text className="mt-6 text-white font-semibold text-base">
          Qual seu comprometimento?
        </Text>
        <TextInput className="h-12 pl-4 rounded-lg mt-3 bg-zinc-800 text-white focus:border-2 focus:border-green-600"
        placeholder="Exercícios, dormir bem, etc..."
        placeholderTextColor={colors.zinc[400]}
        onChangeText={setTitle}
        value={title}
        />

        <Text className="font-semibold mt-4 mb-3 text-white text-base">
          Qual a recorrência? 
        </Text>
        {
          availableWeekDays.map((weekDay, index)=>(
            <CheckBox 
            key={weekDay} 
            title={weekDay}
            checked={weekDays.includes(index)}
            onPress={()=>handleToggleWeekDay(index)}
            />
          ))
        }
        <TouchableOpacity
        className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md"
        activeOpacity={0.7}
        onPress={handleCreateNewHabit}
        >
          <Feather name="check" size={20} color={colors.white} />
          <Text className="font-semibold text-base text-white ml-2">
            Confirmar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}