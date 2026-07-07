import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { sc } from '../SheetStyles';

export default function PersonalInfoSheet() {
  return (
    <View style={sc.wrap}>
      <Text style={sc.sectionLabel}>
        Shaxsiy ma'lumotlar
      </Text>

      <View style={sc.field}>
        <Text style={sc.fieldLabel}>
          Ism
        </Text>

        <TextInput
          style={sc.input}
          defaultValue="Muhammad"
        />
      </View>

      <View style={sc.field}>
        <Text style={sc.fieldLabel}>
          Telefon
        </Text>

        <TextInput
          style={sc.input}
          keyboardType="phone-pad"
          defaultValue="+998770618482"
        />
      </View>

      <TouchableOpacity style={sc.primaryBtn}>
        <Text style={sc.primaryBtnText}>
          Saqlash
        </Text>
      </TouchableOpacity>
    </View>
  );
}