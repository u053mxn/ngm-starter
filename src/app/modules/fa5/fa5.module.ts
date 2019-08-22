import {NgModule} from '@angular/core';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faCalendarCheck, faCreditCard} from '@fortawesome/free-regular-svg-icons';
// tslint:disable-next-line:max-line-length
import {
  faBars,
  faCheck,
  faChevronDown,
  faChevronRight,
  faEllipsisV,
  faFileAlt,
  faFilter,
  faHome,
  faInfo,
  faInfoCircle,
  faPen,
  faQuestion,
  faQuestionCircle,
  faSearch,
  faTimes,
  faTimesCircle,
  faTrash,
  faUser,
  faUsers,
  faCaretDown,
  faCheckCircle,
  faExclamationCircle,
  faExclamationTriangle,
  faExclamation,
  faBuilding,
  faMapMarkerAlt,
  faUserTie,
  faPlaneDeparture,
  faPlane,
  faPhoneAlt,
  faEnvelope,
  faKey,
  faCar,
  faBed,
  faUserFriends,
  faLongArrowAltLeft,
  faDesktop,
  faChevronCircleRight,
  faPlaneArrival,
  faCalendarDay,
  faPlus,
  faBusAlt,
  faMoneyCheckAlt,
  faTaxi,
  faUtensils
} from '@fortawesome/free-solid-svg-icons';

@NgModule({
  declarations: [],
  imports: []
})
export class Fa5Module {
  constructor() {
    library.add(faHome, faUser, faCreditCard, faUsers, faSearch, faEllipsisV, faPen, faTrash, faBars,
      faChevronRight, faTimes, faTimesCircle, faChevronDown, faCheck, faInfo, faInfoCircle,
      faQuestionCircle, faFileAlt, faFilter, faQuestion, faCaretDown, faCheckCircle, faExclamationCircle, faExclamationTriangle,
      faExclamation, faBuilding, faMapMarkerAlt, faUserTie, faPlaneDeparture, faPlaneArrival, faPlane, faCalendarDay, faCalendarCheck,
      faPhoneAlt, faEnvelope, faKey, faCar, faBed, faUserFriends, faLongArrowAltLeft, faDesktop, faChevronCircleRight, faPlus, faBusAlt, faMoneyCheckAlt,
      faTaxi, faUtensils);
  }
}
