import {
  ElButton,
  ElRow,
  ElCol,
  ElAutocomplete
} from 'element-plus'
import lang from 'element-plus/lib/locale/lang/zh-cn'
import locale from 'element-plus/lib/locale'

export default (app) => {
  locale.use(lang)
  app.component(ElButton.name, ElButton)
  app.component(ElRow.name, ElRow)
  app.component(ElAutocomplete.name, ElAutocomplete)
  app.component(ElCol.name, ElCol)
}
