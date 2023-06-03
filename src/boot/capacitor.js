import { defineCustomElements } from '@ionic/pwa-elements/loader'
// import { Device } from '@capacitor/device'
// import { Plugins } from '@capacitor/core'

// const { Device } = Plugins

// async function checkDeviceType () {
//   const info = await Device.getInfo()

//   if (info.platform !== 'ios' && info.platform !== 'android') {
//     window.location.replace(`${process.env.SITE_URL}`)
//   }
// }

// checkDeviceType()

export default () => {
  defineCustomElements(window)
}
