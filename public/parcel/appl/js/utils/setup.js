import Menu from './menu'
import Handlebars from 'handlebars'

window.Stache = Handlebars

export default {
    init () {
        // Show the page
        $('#top-nav').removeAttr('hidden')
        $('#side-nav').removeAttr('hidden')
        Menu.activate('#top-nav div ul li')
        Menu.activate('#side-nav nav ul li')
    }
}
