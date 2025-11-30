import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { bold, regular, logo, menus, f_s, f_xs } from '../config/Constants';
import Dialog from "react-native-dialog";
import { connect } from 'react-redux';
import BackButton from '../views/Dashboard';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';

const partiallyHideEmail = (email) => {
  // Split the email address into username and domain
  const [username, domain] = email.split('@');

  // Get the first three characters of the username
  const hiddenUsername = username.slice(0, 3);

  // Create a partially hidden email by combining the hidden username and the domain
  const partiallyHiddenEmail = `${hiddenUsername}***@${domain}`;

  return partiallyHiddenEmail;
};

const More = (props) => {
  const email = global.email;
  const partiallyHiddenEmail = partiallyHideEmail(email);

  const navigation = useNavigation();
  const [dialog_visible, setDialogVisible] = useState(false);

  const { t } = useLocalization();

  const navigate = (route) => {
    if (route == 'Logout') {
      showDialog();
    } else {
      navigation.navigate(route);
    }
  }
    const goBack = () => {
        navigation.goBack();
      };
  const showDialog = () => {
    setDialogVisible(true);
  }

  const closeDialog = () => {
    setDialogVisible(false);
  }

  const handleCancel = () => {
    setDialogVisible(false)
  }

  const handleLogout = async () => {
    closeDialog();
    navigation.navigate('Logout');
  }

  return (
  <>

    <SafeAreaView style={{ backgroundColor: colors.theme_bg_three, flex: 1 }}>


      <ScrollView>
        <Dialog.Container visible={dialog_visible}>
          <Dialog.Title>Confirm</Dialog.Title>
          <Dialog.Description>
            Do you want to logout?
          </Dialog.Description>
          <Dialog.Button label="Yes" onPress={handleLogout} />
          <Dialog.Button label="No" onPress={handleCancel} />
        </Dialog.Container>

        <View style={{ margin: 15 }}>
{/*           <View style={{ alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderRadius: 55, padding: 2, width: 110, borderColor: colors.grey, borderStyle: 'dotted', alignSelf: 'center' }}> */}
{/*             <View style={{ width: 100, height: 100 }} > */}
{/*               <Image style={{ height: undefined, width: undefined, flex: 1, borderRadius: 75 }} source={logo} /> */}
{/*             </View> */}
{/*           </View> */}
          <View style={{ margin: 5 }} />
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            <Text style={{ color: colors.theme_fg_two, fontSize: 25, fontWeight: 'bold' }}>{t('hey')}, {global.first_name}</Text>
            <TouchableOpacity onPressIn={goBack} style={{}}>
              <Icon type={Icons.Ionicons} name="close-outline" style={{ 
                  fontSize: 55, 
                  color: colors.theme_bg_two 
              }} />
          </TouchableOpacity>
          </View>
          <View style={{ margin: -5 }} />

          <Text style={{ color: colors.text_grey, fontSize: 15, fontWeight: 'regular' }}>{partiallyHiddenEmail}</Text>
          <View style={{ margin: 5 }} />
          <TouchableOpacity onPress={() => navigate('Profile')} style={{ backgroundColor: colors.medics_blue, padding: 7, borderRadius: 10, alignSelf: 'flex-start'}}>
            <Text style={{ color: colors.theme_fg_three, fontSize: f_xs, fontWeight: 'bold' }}>{t('editProfile')}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ margin: 15 }} />
        <FlatList
          data={menus}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => navigate(item.route)} style={{ flexDirection: 'row', width: '100%', padding: 15 }}>
              <View style={{ width: '80%', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
                <View style={{ width: 50 }}>
                  <Icon type={Icons.FontAwesome} name={item.icon} color={colors.medics_grey} style={{ fontSize: 25 }} />
                </View>
                <Text style={{ color: colors.theme_fg_two, fontSize: 25, fontWeight: 'bold' }}>{t(item.route)}</Text>
              </View>
              <View style={{ width: '20%', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
                <Icon type={Icons.FontAwesome5} name="chevron-right" color={colors.text_grey} style={{ fontSize: 25 }} />
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.menu_name}
        />
        <View style={{ margin:10 }}/>
      </ScrollView>
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({

});

function mapStateToProps(state) {
  return {
    first_name: state.register.first_name,
    last_name: state.register.last_name,
    email: state.register.email,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateEmail: (data) => dispatch(updateEmail(data)),
  updateFirstName: (data) => dispatch(updateFirstName(data)),
  updateLastName: (data) => dispatch(updateLastName(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(More);