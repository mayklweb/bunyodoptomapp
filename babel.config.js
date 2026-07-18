module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', {
        jsxImportSource: 'react',
        // import.meta ishlatadigan kutubxonalar uchun Expo'ning
        // rasmiy, xavfsiz yechimi - faqat import.meta'ni almashtiradi,
        // new.target kabi boshqa JS xususiyatlariga tegmaydi
        unstable_transformImportMeta: true,
      }]
    ],
    // Eslatma: react-native-reanimated / react-native-worklets uchun
    // plagin qo'lda qo'shilmaydi - Expo SDK 54'da babel-preset-expo
    // buni avtomatik boshqaradi.
  };
};