import { Component } from '@angular/core';
import { CONTROL_TYPE, FormConfig, OptionsModel } from '../../../../services/components.service';
import { FormControl, FormGroup } from '@angular/forms';
import { PokemonService } from '../../../../services/pokemon.service';
import { map, of } from 'rxjs';

@Component({
  selector: 'app-pokemon-setting',
  templateUrl: './pokemon-setting.component.html',
  styleUrl: './pokemon-setting.component.scss'
})
export class PokemonSettingComponent {
  isDialogVisible = false;
  formConfig: FormConfig[] = [];
  formGroup = new FormGroup({
    generation: new FormControl(''),
    language: new FormControl('en')
  });
  versionList: OptionsModel[] = [];
  languageList: OptionsModel[] = [
    {
      label: 'English',
      value: 'en'
    },
    {
      label: 'Japanese',
      value: 'ja'
    },
    {
      label: 'Chinese',
      value: 'zh-Hans'
    }
  ];
  pokemon: any;

  constructor(
    private pokemonService: PokemonService
  ) {

  }

  ngOnInit() {
    this.pokemonService.pokemonEvent$.subscribe((pokemon: any) => {
      if (pokemon.id) {
        this.pokemon = pokemon;
        const seen = new Set();
        this.versionList = pokemon.species?.flavor_text_entries
          .filter((entry: any) => {
            if (seen.has(entry.version.name)) return false;
            seen.add(entry.version.name);
            return true;
          })
          .map((entry: any) => ({
            label: (entry.version.name.toString()[0].toUpperCase() + entry.version.name.slice(1)).replace(/-/g, ' '),
            value: entry.version.name,
          }));

        const seenLanguage = new Set();
        this.languageList = pokemon.species?.flavor_text_entries
          .filter((entry: any) => {
            if (seenLanguage.has(entry.language.name)) return false;
            seenLanguage.add(entry.language.name);
            return true;
          })
          .map((entry: any) => ({
            label: (entry.language.name[0].toUpperCase() + entry.language.name.slice(1)).replace(/-/g, ' '),
            value: entry.language.name,
          }));

        this.formGroup.controls.generation.setValue(this.versionList[0].value);
        this.formGroup.controls.language.setValue(this.languageList[0].value);
      }
      this.initForm();
    });

    this.formGroup.controls.generation.valueChanges.subscribe(value => {
      this.pokemonService.versionEvents = value ?? '';

      const filtered = this.pokemon.species.flavor_text_entries
        .filter((entry: any) => entry.version.name.includes(this.pokemonService.versionEvents));

      const uniqueLanguages = [
        ...new Set(filtered.map((entry: any) => entry.language.name))
      ];

      this.languageList = uniqueLanguages.map((lang: string) => ({
        label: (lang[0].toUpperCase() + lang.slice(1)).replace(/-/g, ' '),
        value: lang,
      }));
    });

    this.formGroup.controls.language.valueChanges.subscribe(value => {
      this.pokemonService.languageEvents = value ?? '';

      const filtered = this.pokemon.species.flavor_text_entries
        .filter((entry: any) => entry.language.name.includes(this.pokemonService.languageEvents));

      const uniqueVersions = [
        ...new Set(filtered.map((entry: any) => entry.version.name))
      ];

      this.versionList = uniqueVersions.map((ver: string) => ({
        label: (ver[0].toUpperCase() + ver.slice(1)).replace(/-/g, ' '),
        value: ver,
      }));
    });

  }

  initForm() {
    this.formConfig = [
      {
        id: 'GEN',
        label: 'Generation',
        type: CONTROL_TYPE.Dropdown,
        fieldControl: this.formGroup.controls.generation,
        layoutDefine: {
          row: 0,
          column: 0
        },
        dataSourceDependOn: ['LAN'],
        dataSourceAction: () => this.getVersionList()
      },
      {
        id: 'LAN',
        label: 'Language',
        type: CONTROL_TYPE.Dropdown,
        fieldControl: this.formGroup.controls.language,
        layoutDefine: {
          row: 1,
          column: 0
        },
        dataSourceDependOn: ['GEN'],
        dataSourceAction: () => this.getLanguageList()
      }
    ]
  }

  getVersionList() {
    return of(this.versionList);
  }

  getLanguageList() {
    return of(this.languageList);
  }
}
