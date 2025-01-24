import { StyleSheet } from 'react-native'
import { ColorSet } from './Colors'
import { screenWidth } from './ScreenSize'

export default StyleSheet.create({
  p0: {
    padding: 0,
  },
  p5: {
    padding: 5,
  },
  p10: {
    padding: 10,
  },
  p15: {
    padding: 15,
  },
  p20: {
    padding: 20,
  },

  m0: {
    margin: 0,
  },
  m5: {
    margin: 5,
  },
  m10: {
    margin: 10,
  },
  m20: {
    margin: 20,
  },
  m15: {
    margin: 15,
  },
  m25: {
    margin: 25,
  },

  pl3: {
    paddingLeft: 3,
  },
  pl2: {
    paddingLeft: 2,
  },
  pl5: {
    paddingLeft: 5,
  },
  pl10: {
    paddingLeft: 10,
  },
  pl20: {
    paddingLeft: 20,
  },
  pl30: {
    paddingLeft: 30,
  },
  pl40: {
    paddingLeft: 40,
  },
  pl15: {
    paddingLeft: 15,
  },

  ml0: {
    marginLeft: 0,
  },
  ml5: {
    marginLeft: 5,
  },
  ml10: {
    marginLeft: 10,
  },
  ml20: {
    marginLeft: 20,
  },
  ml15: {
    marginLeft: 15,
  },
  ml30: {
    marginLeft: 30,
  },
  ml40: {
    marginLeft: 40,
  },

  
  pr5: {
    paddingRight: 5,
  },
  pr10: {
    paddingRight: 10,
  },
  pr15: {
    paddingRight: 15,
  },
  pr20: {
    paddingRight: 20,
  },
  pr30: {
    paddingRight: 30,
  },
  pr35: {
    paddingRight: 35,
  },
  pr40: {
    paddingRight: 40,
  },
  mr5: {
    marginRight: 5,
  },
  mr10: {
    marginRight: 10,
  },
  mr20: {
    marginRight: 20,
  },
  mr15: {
    marginRight: 15,
  },
  mr30: {
    marginRight: 30,
  },

  pt0: {
    paddingTop: 0,
  },
  pt2: {
    paddingTop: 2,
  },
  pt5: {
    paddingTop: 5,
  },
  pt10: {
    paddingTop: 10,
  },
  pt15: {
    paddingTop: 15,
  },
  pt20: {
    paddingTop: 20,
  },
  pt30: {
    paddingTop: 30,
  },

  mt0: {
    marginTop: 0,
  },
  mt5: {
    marginTop: 5,
  },
  mt10: {
    marginTop: 10,
  },
  mt15: {
    marginTop: 15,
  },
  mt20: {
    marginTop: 20,
  },
  mt30: {
    marginTop: 30,
  },
  mt40: {
    marginTop: 40,
  },
  mt50: {
    marginTop: 50,
  },

  pb0: {
    paddingBottom: 0,
  },
  pb5: {
    paddingBottom: 5,
  },
  pb10: {
    paddingBottom: 10,
  },
  pb15: {
    paddingBottom: 15,
  },
  pb20: {
    paddingBottom: 20,
  },

  mb5: {
    marginBottom: 5,
  },
  mb10: {
    marginBottom: 10,
  },
  mb15: {
    marginBottom: 15,
  },
  mb20: {
    marginBottom: 20,
  },
  mb30: {
    marginBottom: 30,
  },
  mb40: {
    marginBottom: 40,
  },
  mb50: {
    marginBottom: 50,
  },
  mb60: {
    marginBottom: 60,
  },

  pv0: {
    paddingVertical: 0,
  },
  pv5: {
    paddingVertical: 5,
  },
  pv10: {
    paddingVertical: 10,
  },
  pv15: {
    paddingVertical: 15,
  },
  pv20: {
    paddingVertical: 20,
  },
  pv25: {
    paddingVertical: 25,
  },
  pv30: {
    paddingVertical: 30,
  },
  mv0: {
    marginVertical: 0,
  },
  mv5: {
    marginVertical: 5,
  },
  mv10: {
    marginVertical: 10,
  },
  mtN10: {
    marginTop: -10,
  },
  mtN40: {
    marginTop: -40,
  },
  mvN10: {
    marginVertical: -10,
  },
  mv20: {
    marginVertical: 20,
  },
  mv30: {
    marginVertical: 30,
  },
  mv40: {
    marginVertical: 40,
  },

  ph0: {
    paddingHorizontal: 0,
  },
  ph5: {
    paddingHorizontal: 5,
  },
  ph10: {
    paddingHorizontal: 10,
  },
  ph15: {
    paddingHorizontal: 15,
  },
  ph20: {
    paddingHorizontal: 20,
  },
  ph30: {
    paddingHorizontal: 30,
  },
  mh5: {
    marginHorizontal: 5,
  },
  mh10: {
    marginHorizontal: 10,
  },
  mh15: {
    marginHorizontal: 15,
  },
  mh20: {
    marginHorizontal: 20,
  },

  mh30: {
    marginHorizontal: 30,
  },
  mh40: {
    marginHorizontal: 40,
  },
  mh50: {
    marginHorizontal: 50,
  },

  mbN20: {
    marginBottom: -20,
  },
  mhN20: {
    marginHorizontal: -20,
  },

  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  flex3: {
    flex: 3,
  },
  flex4: {
    flex: 4,
  },
  flex5: {
    flex: 5,
  },

  row: {
    flexDirection: 'row',
  },
  column:{
    flexDirection: 'column',
  },
  rowSpaceBetween:{
    flexDirection: "row", justifyContent: "space-between" 
  },
  rowStart: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  rowEnd: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowBtw: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowArround: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  aiFlexStart: {
    alignItems: 'flex-start',
  },
  aiFlexEnd: {
    alignItems: 'flex-end',
  },
  aiCenter: {
    alignItems: 'center',
  },
  jcCenter: {
    justifyContent: 'center',
  },
  jcFlexStart: {
    justifyContent: 'flex-start',
  },
  jcFlexEnd: {
    justifyContent: 'flex-end',
  },
  jcSpaceBetween: {
    justifyContent: 'space-between',
  },
  jcSpaceEvenly: {
    justifyContent: 'space-evenly',
  },
  jcSpaceAround: {
    justifyContent: 'space-around',
  },
  asCenter: {
    alignSelf: 'center',
  },
  taCenter: {
    textAlign: 'center',
  },
  asFlexStart: {
    alignSelf: 'flex-start',
  },
  asFlexEnd: {
    alignSelf: 'flex-end',
  },

  colCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  txtCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  safeAreaView: {
    position: 'relative',
    flex: 1,
  },

  w10: {
    width: '10%',
  },
  w20: {
    width: '20%',
  },
  w25: {
    width: '25%',
  },

  w30: {
    width: '30%',
  },
  w33: {
    width: '33%',
  },
  w45: {
    width: '45%',
  },
  w40: {
    width: '40%',
  },
  w50: {
    width: '50%',
  },
  w55: {
    width: '55%',
  },
  w60: {
    width: '60%',
  },
  w70: {
    width: '70%',
  },
  w75: {
    width: '75%',
  },
  w80: {
    width: '80%',
  },
  w90: {
    width: '90%',
  },
  w100: {
    width: '100%',
  },

  bTop: {
    borderTopColor: ColorSet.border,
    borderTopWidth: 1.5,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerTitleCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  divider: {
    width: screenWidth.width100,
    borderWidth: 0.5,
    borderColor: '#D9D9D9',
    marginHorizontal: -20,
  },
  textLink: {
    color: ColorSet.theme,
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
    textDecorationColor: ColorSet.theme,
  },
  headContainer: {
    paddingTop: 20,
  },
  whishlistIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  wrapper: {
    flex: 1,
    padding: 20
  },
  buttonTransparent: {
    backgroundColor: 'transparent',
    paddingHorizontal: 15,
    borderRadius: 5,
  }
})
