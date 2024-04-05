import React, {useState} from 'react';
import {Modal, View, Text, TouchableOpacity} from 'react-native';
import {Icon} from '@rneui/base';

const ProfileModal = () => {
  const [modalVisible, setModalVisible] = useState(true);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{backgroundColor: 'white', padding: 20}}>
            <Text style={{padding: 10}}>Username</Text>
            <Text style={{padding: 10}}>Email</Text>
            <Text style={{padding: 10}}>Password</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{padding: 10}}
            >
              <Icon name="close" color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileModal;
