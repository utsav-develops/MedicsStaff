// SwiperContent.jsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';

const SwiperContent = ({ todayBookings, todayEarnings, currency }) => {
 const { t } = useLocalization();
  return (
    <Swiper style={styles.swiper} showsButtons={false} showsPagination={true}>
      <View style={styles.slide}>
        <Text style={styles.money}>{currency}{todayEarnings}</Text>
        <Text style={styles.label}>{t('today')}</Text>
        <Text style={styles.subLabel}>{t('youHave')} {todayBookings} {t('bookingHave')}</Text>
        {/* ... Additional content for Today's slide */}
      </View>
      <View style={styles.slide}>
        <Text style={styles.label}>{t('weeklySummary')}</Text>
        {/* ... Additional content for Weekly's slide */}
      </View>
      <View style={styles.slide}>
        <Text style={styles.label}>{t('monthlySummary')}</Text>
        {/* ... Additional content for Monthly's slide */}
      </View>
    </Swiper>
  );
};

const styles = StyleSheet.create({
  swiper: {
    // Styles for swiper
  },
  slide: {
    // Styles for each slide
  },
  money: {
    // Styles for the money text
  },
  label: {
    // Styles for the label text
  },
  subLabel: {
    // Styles for the sublabel text
  },
  // ... any additional styles
});

export default SwiperContent;
