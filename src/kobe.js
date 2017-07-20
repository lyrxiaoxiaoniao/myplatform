/*
 *  Kobe UI Version 0.0.1
 *
 *  A UI Component Collection Based On ElementUI and AdminLTE
 * */
import Login from 'components/kobe/Login'
import Forgot from 'components/kobe/Forgot'
import Button from 'components/kobe/Button'
import Table from 'components/kobe/Table'
import Unknown from 'components/kobe/404'
import InfoCell from 'components/kobe/InfoCell'
import ImagePane from 'components/kobe/ImagePane'
import ActiveInput from 'components/kobe/ActiveInput'
import InfoDialog from 'components/kobe/InfoDialog'
import ActiveForm from 'components/kobe/ActiveForm'
import TableDialog from 'components/kobe/TableDialog'
import NumInput from 'components/kobe/NumInput'
import DateInput from 'components/kobe/DateInput'
import DoubleDate from 'components/kobe/DoubleDate'
import TagGroup from 'components/kobe/TagGroup'
import SwitchInput from 'components/kobe/ActiveSwitch'
import RadioInput from 'components/kobe/ActiveRadio'
import ActiveTextarea from 'components/kobe/ActiveTextarea'
import ActiveUpload from 'components/kobe/ActiveUpload'
import ActiveCheckbox from 'components/kobe/ActiveCheckbox'
import ActiveSelect from 'components/kobe/ActiveSelect'
import MapDialog from 'components/kobe/MapDialog'
import UploadFile from 'components/kobe/UploadFile'
import ActiveRank from 'components/kobe/ActiveRank'
import ActiveCert from 'components/kobe/ActiveCert'
import ActiveSign from 'components/kobe/ActiveSign'
import ActiveAttendee from 'components/kobe/ActiveAttendee'
import ActiveAttendence from 'components/kobe/ActiveAttendence'
import ActiveAttendenceMode from 'components/kobe/ActiveAttendenceMode'
import CategoryTree from 'components/kobe/CategoryTree'
import TutorialUpload from 'components/kobe/tutorial/TutorialUpload'
import TutorialCheck from 'components/kobe/tutorial/TutorialCheck'
import TutorialType from 'components/kobe/tutorial/TutorialType'
import TutorialPublishBasic from 'components/kobe/tutorial/PublishBasicForm'
import TutorialCategory from 'components/kobe/tutorial/TutorialCategory'
import TutorialPublish from 'components/kobe/tutorial/PublishForm'
import TutorialTime from 'components/kobe/tutorial/TutorialTime'
import TutorialHTML from 'components/kobe/tutorial/TutorialHTML'
import TutorialMaterial from 'components/kobe/tutorial/TutorialMaterial'
import TutorialSignin from 'components/kobe/tutorial/TutorialSignin'
import TutorialAward from 'components/kobe/tutorial/TutorialAward'
import TutorialTest from 'components/kobe/tutorial/TutorialTest'

const install = (Vue) => {
  Vue.component('kobe-login', Login)
  Vue.component('kobe-forgot', Forgot)
  Vue.component('kobe-button', Button)
  Vue.component('kobe-table', Table)
  Vue.component('kobe-404', Unknown)
  Vue.component('kobe-info-cell', InfoCell)
  Vue.component('kobe-image-pane', ImagePane)
  Vue.component('kobe-active-input', ActiveInput)
  Vue.component('kobe-info-dialog', InfoDialog)
  Vue.component('kobe-active-form', ActiveForm)
  Vue.component('kobe-table-dialog', TableDialog)
  Vue.component('kobe-number-input', NumInput)
  Vue.component('kobe-date-input', DateInput)
  Vue.component('kobe-double-date', DoubleDate)
  Vue.component('kobe-tag-group', TagGroup)
  Vue.component('kobe-active-switch', SwitchInput)
  Vue.component('kobe-active-radio', RadioInput)
  Vue.component('kobe-active-textarea', ActiveTextarea)
  Vue.component('kobe-active-upload', ActiveUpload)
  Vue.component('kobe-active-checkbox', ActiveCheckbox)
  Vue.component('kobe-active-select', ActiveSelect)
  Vue.component('kobe-map-dialog', MapDialog)
  Vue.component('kobe-upload-file', UploadFile)
  Vue.component('kobe-active-rank', ActiveRank)
  Vue.component('kobe-active-cert', ActiveCert)
  Vue.component('kobe-active-sign', ActiveSign)
  Vue.component('kobe-active-attendee', ActiveAttendee)
  Vue.component('kobe-active-attendence', ActiveAttendence)
  Vue.component('kobe-active-attendence-mode', ActiveAttendenceMode)
  Vue.component('kobe-category-tree', CategoryTree)
  Vue.component('kobe-tutorial-upload', TutorialUpload)
  Vue.component('kobe-tutorial-check', TutorialCheck)
  Vue.component('kobe-tutorial-type', TutorialType)
  Vue.component('kobe-tutorial-publish-basic', TutorialPublishBasic)
  Vue.component('kobe-tutorial-category', TutorialCategory)
  Vue.component('kobe-tutorial-publish-form', TutorialPublish)
  Vue.component('kobe-tutorial-time', TutorialTime)
  Vue.component('kobe-tutorial-html', TutorialHTML)
  Vue.component('kobe-tutorial-material', TutorialMaterial)
  Vue.component('kobe-tutorial-signin', TutorialSignin)
  Vue.component('kobe-tutorial-award', TutorialAward)
  Vue.component('kobe-tutorial-test', TutorialTest)
}

export default install
