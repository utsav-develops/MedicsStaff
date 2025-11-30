import React, { useEffect, useRef, useState } from "react";
import {
  View, StyleSheet, Text, Image, TouchableOpacity, ScrollView, StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { connect } from 'react-redux';
import DropdownAlert from 'react-native-dropdownalert';
import axios from 'axios';
import { normal, bold, img_url, api_url, get_documents, upload_icon, id_proof_icon, speciality_certificate_icon, speciality_insurance_icon, speciality_image_icon, speciality_vaccine_icon, speciality_dbs_icon, f_xl, f_l, f_xs, f_s, f_m } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';


const UploadedDocuments = (props) => {
  const navigation = useNavigation();
  const { t } = useLocalization();
  let dropDownAlertRef = useRef();
  const [loading, setLoading] = useState(false);
  const [id_proof, setIdProof] = useState({
    path: id_proof_icon,
    status: 0,
    status_name: "Waiting for upload",
    color: colors.warning
  });
  const [speciality_image, setSpecialityImage] = useState({
    path: speciality_image_icon,
    status: 0,
    status_name: "Waiting for upload",
    color: colors.warning
  });
  const [speciality_certificate, setSpecialityCertificate] = useState({
    path: speciality_certificate_icon,
    status: 0,
    status_name: "Waiting for upload",
    color: colors.warning
  });


  const [speciality_insurance, setSpecialityInsurance] = useState({
    path: speciality_insurance_icon,
    status: 0,
    status_name: "Waiting for upload",
    color: colors.warning
  });
  const [speciality_dbs, setSpecialitydbs] = useState({
    path: speciality_dbs_icon,
    status: 0,
    status_name: "Waiting for upload",
    color: colors.warning
  });
  const [speciality_vaccine, setSpecialityVaccine] = useState({
    path: speciality_vaccine_icon,
    status: 0,
    status_name: "Waiting for upload",
    color: colors.warning
  });

  const [speciality_id, setSpecialityId] = useState(0);
  const [upload_status, setUploadStatus] = useState(0);

  useEffect(() => {
    subscribe = navigation.addListener("focus", async () => {
      call_get_documents();
    });
    return subscribe;
  }, []);


  const find_document = (list) => {
    list.map((data, index) => {
      let value = { path: { uri: img_url + data.path }, status: data.status, status_name: data.status_name, color: get_status_foreground(data.status) }
      if (data.document_name == 'id_proof') {
        setIdProof(value);
      } else if (data.document_name == 'speciality_image') {
        setSpecialityImage(value);
      } else if (data.document_name == 'speciality_certificate') {
        setSpecialityCertificate(value);
      } else if (data.document_name == 'speciality_insurance') {
        setSpecialityInsurance(value);
      } else if (data.document_name == 'speciality_dbs') {
        setSpecialitydbs(value);
      } else if (data.document_name == 'speciality_vaccine') {
        setSpecialityVaccine(value);
      }
    })
  }

  const get_status_foreground = (status) => {
    if (status == 17) {
      return colors.error
    } else if (status == 14 || status == 15) {
      return colors.warning
    } else if (status == 16) {
      return colors.success
    }
  }

  const move_to_upload = (slug, status, path) => {
    let table = slug == "id_proof" ? "staffs" : "staff_specialities";
    let find_field = slug == "id_proof" ? "id" : "id";
    let find_value = slug == "id_proof" ? global.id : speciality_id;
    let status_field = slug == "id_proof" ? 'id_proof_status' : slug + '_status';
    if (status == 14) {
      navigation.navigate("DocumentUpload", { slug: slug, path: upload_icon, status: status, table: table, find_field: find_field, find_value: find_value, status_field: status_field });
    } else {
      navigation.navigate("DocumentUpload", { slug: slug, path: path, status: status, table: table, find_field: find_field, find_value: find_value, status_field: status_field });
    }
  }

  const go_back = () => {
    navigation.goBack();
  }

  const call_get_documents = async () => {
    setLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_documents,
      data: { staff_id: global.id, lang: global.lang }
    })
      .then(async response => {
        setLoading(false);
        setSpecialityId(response.data.result.details.speciality_id);

        // Check if all documents are uploaded and awaiting approval
        const allDocumentsUploaded = response.data.result.documents.every(doc => doc.status === 15);
        if (allDocumentsUploaded) {
          setUploadStatus(1);
        } else {
          find_document(response.data.result.documents)
        }
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
        dropDownAlertRef.alertWithType('error',  t('error'), t('smthgWentWrong'));
      });
  }


  const drop_down_alert = () => {
    return (
      <DropdownAlert
        ref={(ref) => {
          if (ref) {
            dropDownAlertRef = ref;
          }
        }}
      />
    )
  }

  return (
     <>
    <View
    style={{
      backgroundColor: colors.theme_bg,
      height: Platform.OS === 'ios' ? 50 : 0,
    }}>
    <StatusBar
      backgroundColor={colors.theme_bg}

    />
  </View> 
        <View style={[styles.header]}>
        <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
          <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
        </TouchableOpacity>
        <View activeOpacity={1} style={{ width: '85%', alignItems: 'flex-start', justifyContent: 'center' }}>
              <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_xl, fontWeight: 'bold' }}>{t('yourDocument')}</Text>
          </View>
      </View>
    <ScrollView style={styles.container}>
      {upload_status == 0 ?
        <View style={{ padding: 10 }}>
          <View style={{ margin: 10 }} />
          <View>
            <Text style={{ fontWeight: 'bold', color: colors.theme_fg_two, fontSize: f_l }}>
              {t('idProof')}
            </Text>
            <Text style={{ fontWeight: 'normal', color: colors.grey, fontSize: f_xs }}>
            </Text>
            <View style={{ margin: 10 }} />
            <TouchableOpacity onPress={move_to_upload.bind(this, 'id_proof', id_proof.status, id_proof.path)} activeOpacity={1} style={{ borderWidth: 1, padding: 10, borderRadius: 5, borderStyle: 'dashed', flexDirection: 'row' }}>
              <View style={{ width: '70%' }}>
                <Text style={{ fontWeight: 'bold', color: id_proof.color, fontSize: f_s }}> {t('idProof')}</Text>
                <View style={{ margin: 5 }} />
                <Text style={{ fontWeight: 'normal', color: colors.grey, fontSize: f_xs }}>{t('yourPassport_driving')}</Text>
              </View>
              <View style={{ width: '30%', alignItems: 'center', justifyContent: 'center' }}>
                <Image source={id_proof.path} style={{ height: 75, width: 75 }} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ margin: 10 }} />
          <View>
            <Text style={{ fontWeight: 'bold', color: colors.theme_fg_two, fontSize: f_l }}>
              {t('yourPicture')}
            </Text>
            <Text style={{ fontWeight: 'normal', color: colors.grey, fontSize: f_xs }}>
            </Text>
            <View style={{ margin: 10 }} />
            <TouchableOpacity onPress={move_to_upload.bind(this, 'speciality_image', speciality_image.status, speciality_image.path)} activeOpacity={1} style={{ borderWidth: 1, padding: 10, borderRadius: 5, borderStyle: 'dashed', flexDirection: 'row' }}>
              <View style={{ width: '70%' }}>
                <Text style={{ fontWeight: 'bold', color: speciality_image.color, fontSize: f_s }}> {t('yourPicture')}</Text>
                <View style={{ margin: 5 }} />
                <Text style={{ fontWeight: 'normal', color: colors.grey, fontSize: f_xs }}> {t('yourPicture')}</Text>
              </View>
              <View style={{ width: '30%', alignItems: 'center', justifyContent: 'center' }}>
                <Image source={speciality_image.path} style={{ height: 75, width: 75 }} />
              </View>
            </TouchableOpacity>
          </View>





          <View style={{ margin: 10 }} />
          <View>
            <Text style={{ fontWeight: 'bold', color: colors.theme_fg_two, fontSize: f_l }}>
              {t('certificate')}
            </Text>
            <Text style={{ fontWeight: 'normal', color: colors.grey, fontSize: f_xs }}>
            </Text>
            <View style={{ margin: 10 }} />
            <TouchableOpacity onPress={move_to_upload.bind(this, 'speciality_certificate', speciality_certificate.status, speciality_certificate.path)} activeOpacity={1} style={{ borderWidth: 1, padding: 10, borderRadius: 5, borderStyle: 'dashed', flexDirection: 'row' }}>
              <View style={{ width: '70%' }}>
                <Text style={{ fontWeight: 'bold', color: speciality_certificate.color, fontSize: f_s }}> {t('certificate')}</Text>
                <View style={{ margin: 5 }} />
                <Text style={{ fontWeight: 'normal', color: colors.grey, fontSize: f_xs }}>{t('yourCertificate')}</Text>
              </View>
              <View style={{ width: '30%', alignItems: 'center', justifyContent: 'center' }}>
                <Image source={speciality_certificate.path} style={{ height: 75, width: 75 }} />
              </View>
            </TouchableOpacity>
          </View>


          <View style={{ margin: 10 }} />
          <View>
            <Text style={{ fontWeight: 'bold', color: colors.theme_fg_two, fontSize: f_l }}>
              {t('nmcRegistrationCertificate')}
            </Text>
            <Text style={{ fontWeight: 'normal', color: colors.grey, fontSize: f_xs }}>
            </Text>
            <View style={{ margin: 10 }} />
            <TouchableOpacity onPress={move_to_upload.bind(this, 'speciality_insurance', speciality_insurance.status, speciality_insurance.path)} activeOpacity={1} style={{ borderWidth: 1, padding: 10, borderRadius: 5, borderStyle: 'dashed', flexDirection: 'row' }}>
              <View style={{ width: '70%' }}>
                <Text style={{ fontWeight: 'bold', color: speciality_insurance.color, fontSize: f_s }}>{t('nmcRegistrationCertificate')}</Text>
                <View style={{ margin: 5 }} />
                <Text style={{ fontWeight: 'normal', color: colors.grey, fontSize: f_xs }}>{t('yourNMCCertificate')}</Text>
              </View>
              <View style={{ width: '30%', alignItems: 'center', justifyContent: 'center' }}>
                <Image source={speciality_insurance.path} style={{ height: 75, width: 75 }} />
              </View>
            </TouchableOpacity>
          </View>






 {/* Add UI component for speciality_dbs like the others */}

<View style={{ margin: 10 }} />
{/*   <View> */}
{/*          <Text style={{ fontWeight: 'bold', color: colors.theme_fg_two, fontSize: f_l }}> */}
{/*            DBS Document */}
{/*            </Text> */}
{/*              <Text style={{ fontWeight: 'normal', color: colors.grey, fontSize: f_xs }}> */}
{/*              </Text> */}
{/*              <View style={{ margin: 10 }} /> */}
{/*          <TouchableOpacity onPress={move_to_upload.bind(this, 'speciality_dbs', speciality_dbs.status, speciality_dbs.path)} activeOpacity={1} style={{ borderWidth: 1, padding: 10, borderRadius: 5, borderStyle: 'dashed', flexDirection: 'row' }}> */}
{/*            <View style={{ width: '70%' }}> */}
{/*              <Text style={{ fontWeight: 'bold', color: speciality_dbs.color, fontSize: f_s }}>DBS Document</Text> */}
{/*              <View style={{ margin: 5 }} /> */}
{/*              <Text style={{ fontWeight: 'normal', color: colors.grey, fontSize: f_xs }}>Your DBS document</Text> */}
{/*            </View> */}
{/*            <View style={{ width: '30%', alignItems: 'center', justifyContent: 'center' }}> */}
{/*              <Image source={speciality_dbs.path} style={{ height: 75, width: 75 }} /> */}
{/*            </View> */}
{/*          </TouchableOpacity> */}
{/*         </View> */}












          <View style={{ margin: 10 }} />
{/*           <View> */}
{/*             <Text style={{ fontWeight: 'bold', color: colors.theme_fg_two, fontSize: f_l }}> */}
{/*               {t('vaccineProof')} */}
{/*             </Text> */}
{/*             <Text style={{ fontWeight: 'normal', color: colors.grey, fontSize: f_xs }}> */}

{/*             </Text> */}
{/*             <View style={{ margin: 10 }} /> */}
{/*             <TouchableOpacity onPress={move_to_upload.bind(this, 'speciality_vaccine', speciality_vaccine.status, speciality_vaccine.path)} activeOpacity={1} style={{ borderWidth: 1, padding: 10, borderRadius: 5, borderStyle: 'dashed', flexDirection: 'row' }}> */}
{/*               <View style={{ width: '70%' }}> */}
{/*                 <Text style={{ fontWeight: 'bold', color: speciality_vaccine.color, fontSize: f_s }}>{t('vaccineProof')}</Text> */}
{/*                 <View style={{ margin: 5 }} /> */}
{/*                 <Text style={{ fontWeight: 'normal', color: colors.grey, fontSize: f_xs }}>{t('yourVaccineProof')}</Text> */}
{/*               </View> */}
{/*               <View style={{ width: '30%', alignItems: 'center', justifyContent: 'center' }}> */}
{/*                 <Image source={speciality_vaccine.path} style={{ height: 75, width: 75 }} /> */}
{/*               </View> */}
{/*             </TouchableOpacity> */}
{/*           </View> */}
        </View>
        :
        <View style={{ padding: 20, alignItems: 'center', justifyContent: 'center' }}>

        </View>
      }
      
    </ScrollView>
    {drop_down_alert()}
    </>
  );
};

const styles = StyleSheet.create({
    container: {
    backgroundColor: colors.theme,
    },
  header: {
    height: 60,
    backgroundColor: colors.theme_bg,
    flexDirection: 'row',
    alignItems: 'center'
  },
  flex_1: {
    flex: 1
  },
  icon: {
    color: colors.theme_fg_three
  },
  header_body: {
    flex: 3,
    justifyContent: 'center'
  },
  upload_image: {
    width: 150,
    height: 150,
    borderColor: colors.theme_bg_three,
    borderWidth: 1
  },
  body_section: {
    width: '100%',
    backgroundColor: colors.theme_bg_three,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    marginBottom: 30,
    paddingBottom: 20
  },
  footer_section: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10
  },
  name_title: {
    alignSelf: 'center',
    color: colors.theme_fg,
    alignSelf: 'center',
    fontSize: 20,
    letterSpacing: 0.5,
    fontWeight: 'bold'
  },
  footer: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: colors.theme_bg
  },
  cnf_button_style: {
    backgroundColor: colors.theme_bg,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default connect(null, null)(UploadedDocuments);