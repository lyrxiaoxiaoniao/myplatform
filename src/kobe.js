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
}

export default install
