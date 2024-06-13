import { NgModule } from "@angular/core";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { CommonModule, registerLocaleData } from "@angular/common";

// Import PrimeNG modules
import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CarouselModule } from 'primeng/carousel';
import { CascadeSelectModule } from 'primeng/cascadeselect';
// import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DockModule } from 'primeng/dock';
import { DragDropModule } from 'primeng/dragdrop';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
// import { EditorModule } from 'primeng/editor';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { InplaceModule } from 'primeng/inplace';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ImageModule } from 'primeng/image';
import { KnobModule } from 'primeng/knob';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { ScrollerModule } from 'primeng/scroller';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { SkeletonModule } from 'primeng/skeleton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SpeedDialModule } from 'primeng/speeddial';
import { SpinnerModule } from 'primeng/spinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SplitterModule } from 'primeng/splitter';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { TreeModule } from 'primeng/tree';
import { TreeSelectModule } from 'primeng/treeselect';
import { TreeTableModule } from 'primeng/treetable';
import { AnimateModule } from 'primeng/animate';
import { CardModule } from 'primeng/card';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
//#region Angular Material
// import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSliderModule} from '@angular/material/slider';
import { NavsideComponent } from "src/app/shared/navside/navside.component";
import { PerfilComponent } from "../perfil/perfil.component";
import { TaskmanagerComponent } from "../taskmanager/taskmanager.component";
import { CursosComponent } from "../cursos/cursos.component";
import { InstitucionesComponent } from "../cursos/instituciones/instituciones.component";
import { ModalImgInstitucionesComponent } from "../cursos/instituciones/modal-img-instituciones/modal-img-instituciones.component";
import { ModalCursosComponent } from "../cursos/instituciones/modal-cursos/modal-cursos.component";
import { EstudiantesComponent } from "../cursos/estudiantes/estudiantes.component";
import localeEs from '@angular/common/locales/es';

/**Para cambiar el lenguaje de la fecha a español */
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from "@angular/material-moment-adapter";
import { CronoCursosComponent } from "../cursos/crono-cursos/crono-cursos.component";
import { VistasEstudiantesFormComponent } from "../cursos/estudiantes/vistas-estudiantes-form/vistas-estudiantes-form.component";
import { ProfesoresComponent } from "../profesores/profesores.component";
import { AreasComponent } from "../areas/areas.component";

// Registra el idioma español latino
registerLocaleData(localeEs, 'es');

@NgModule({
    declarations: [
      DashboardComponent,
      NavsideComponent,
      PerfilComponent,
      TaskmanagerComponent,
      CursosComponent,
      InstitucionesComponent,
      ModalImgInstitucionesComponent,
      ModalCursosComponent,
      EstudiantesComponent,
      CronoCursosComponent,
      VistasEstudiantesFormComponent,
      ProfesoresComponent,
      AreasComponent
    ],
    imports: [
      CommonModule,
      MatSliderModule,
      MatTooltipModule,
      AvatarModule,
      AvatarGroupModule,
      AccordionModule,
      AutoCompleteModule,
      BadgeModule,
      BreadcrumbModule,
      BlockUIModule,
      ButtonModule,
      CalendarModule,
      CarouselModule,
      CascadeSelectModule,
      // ChartModule,
      CheckboxModule,
      ChipsModule,
      ChipModule,
      ColorPickerModule,
      ConfirmDialogModule,
      ContextMenuModule,
      VirtualScrollerModule,
      DataViewModule,
      DialogModule,
      DividerModule,
      DockModule,
      DragDropModule,
      DropdownModule,
      DynamicDialogModule,
      // EditorModule,
      FieldsetModule,
      FileUploadModule,
      GalleriaModule,
      InplaceModule,
      InputMaskModule,
      InputSwitchModule,
      InputTextModule,
      InputTextareaModule,
      InputNumberModule,
      ImageModule,
      KnobModule,
      ListboxModule,
      MegaMenuModule,
      MenuModule,
      MenubarModule,
      MessageModule,
      MessagesModule,
      MultiSelectModule,
      OrganizationChartModule,
      OrderListModule,
      OverlayPanelModule,
      PaginatorModule,
      PanelModule,
      PanelMenuModule,
      PasswordModule,
      PickListModule,
      ProgressSpinnerModule,
      ProgressBarModule,
      RadioButtonModule,
      RatingModule,
      SelectButtonModule,
      SidebarModule,
      ScrollerModule,
      ScrollPanelModule,
      ScrollTopModule,
      SkeletonModule,
      SlideMenuModule,
      SliderModule,
      SpeedDialModule,
      SpinnerModule,
      SplitterModule,
      SplitButtonModule,
      StepsModule,
      TableModule,
      TabMenuModule,
      TabViewModule,
      TagModule,
      TerminalModule,
      TieredMenuModule,
      TimelineModule,
      ToastModule,
      ToggleButtonModule,
      ToolbarModule,
      TooltipModule,
      TriStateCheckboxModule,
      TreeModule,
      TreeSelectModule,
      TreeTableModule,
      AnimateModule,
      CardModule,
      PortalModule,
      ScrollingModule,
      CdkStepperModule,
      CdkTableModule,
      CdkTreeModule,
      MatAutocompleteModule,
      MatBadgeModule,
      MatBottomSheetModule,
      MatButtonModule,
      MatDatepickerModule,
      MatButtonToggleModule,
      MatCardModule,
      MatCheckboxModule,
      MatChipsModule,
      MatStepperModule,
      MatDatepickerModule,
      MatDialogModule,
      MatDividerModule,
      MatExpansionModule,
      MatGridListModule,
      MatIconModule,
      MatInputModule,
      MatListModule,
      MatMenuModule,
      MatNativeDateModule,
      MatPaginatorModule,
      MatProgressBarModule,
      MatProgressSpinnerModule,
      MatRadioModule,
      MatSelectModule,
      /** --------------- */
      FormsModule,
      ReactiveFormsModule
      /** --------------- */
    ], exports: [
      NavsideComponent,
      PerfilComponent,
      TaskmanagerComponent,
      CursosComponent,
      InstitucionesComponent,
      EstudiantesComponent,
      CronoCursosComponent,
      VistasEstudiantesFormComponent,
      ProfesoresComponent,
      AreasComponent
    ],
    providers: [
      // Configura el idioma para el datepicker
      { provide: MAT_DATE_LOCALE, useValue: 'es' },
      { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
      { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
      // Otros proveedores
    ],
  })


export class OrangeModule { }