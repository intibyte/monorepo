# CMS / CRM

# Čo vlastne chcem dosiahnuť?

**Starý prístup**:

1. požiadavky zákazníka
2. špecifikácia
3. implementácia
4. testovanie
5. výsledný produkt

**Nový prístup**:

1. požiadavky zákazníka
2. **špecifikácia do JSON súborov podľa vopred zadefinovanej schémy**
3. **tool ktorý na základe špecifikácie rovno vytvorí výsledný produkt**
4. výsledný produkt

Transformovanie požiadaviek zákazníka do JSON špecifikácie môže robiť AI.

**Takže vo výsledku user iba diktuje požiadavky do AI a ako výsledok user dostáva hotový produkt.**

### Menej AI prístup by mohol fungovať asi takto:

1. V nejakom software-i si namodelujem DB model (entity, vztahy).
2. Potom namodelujem (v rovnakom alebo v nejakom inom software-i) CRUDy atd.
3. Výsledkom týchto "modelovani" su nejaké JSONy.
4. Na základe týchto JSONov sa potom "vygeneruje" konkrétna appka.

Tento pristup sa líší od prístupu aký má napr. Filament v tom, že "modelovanie" je oddelené od "implementácie", kdežto
pri Filamente sa "modeluje" priamo v PHP kóde a teda "model" je naviazaný na konkrétnu technológiu (v tomto prípade
PHP + Laravel + Livewire ...).

Náš prístup je viac generický:

- model
- generátor
- vygenerovaný kód (hotová appka)

# Aktuálny stav

- Systém
    - [ ] priprav backend module ako fresh laravel
    - [ ] priprav frontend module ako fresh Quasar
    - [ ] implementuj prihlasovanie / odhlasovanie
- CRUD
    - Mám zadefinovanú JSON schému
    - Mám spravený validátor ako npm-package ktorý exportuje `validate` funkciu na validovanie.
    - Ďalšie kroky by mali byť:
        - [ ] Spraviť Vue component (možno ako Quasar app-extension) na editáciu tých JSONov

# Big Picture pohľad na systém

## Čo chcem

- Rozdeliť systém na malé časti
    - ktoré budú od seba oddelené
    - každá bude mať stanovené svoje responsibilities
    - pri vývoji každen časti rozmýšlaj len nad danou časťou, nie nad celým systémom
    - systém by mal "vzniknúť" ako suma častí
- Tieto "časti" nie sú len kusy kódu alebo repozitáre, môže to byť čokľvek
    - moduly
    - špecifikácie
    - JSON schémy
    - npm moduly
    - Vue componenty
    - composer PHP packages
    - Laravel projekty
    - atď.

## Identifikované časti

- data model dokument - konktérny JSON súbor obsahujúci definíciu nejakého dátového modelu napr. pre eshop a pod.
- data model JSON schéma - JSON Schema dokument, ktorý popisuje pravidlá, ako maju vyzerať "JSON data modely", čo sú
  JSON súbory obsahujúce informácie o nejakom dátovom modeli, napr. eshop, blog a pod.
- data model špecifikácie pre ľudí - to isté ale čitateľné pre ľudí
- data model validátor - nejaký NPM package + môžem spraviť aj nejakú Electron appku k tomu a pod. alebo nejaký CLI
  command a pod.
- Vue data model manager pomocou ktorého si user bude vedieť vyklikať svoj dátový model
- Data Model Manager App - môže byť implementované ako Elector appka napr. a bude vlastne iba zaobalovať "Vue data model
  manager" časť

# Flow

1. User si zadefinuje svoj dátový model
    - Ručne tak že vytvorí JSON súbor
    - Vykliká pomocou Data Model Manager App
2. User má niekde nainštalovanú svoju appku (eshop, blog ...) a tam niekde bude mať button že "Apply Data Model".
3. Vyberie súbor
4. Uploadne
5. Na backende sa spustí:
    - Validátor môže overiť či je ten dátový model validný
    - Identifikujú sa potrebné zmeny oproti súččasnému stavu
    - Môže to byť tak spravené ako v kubernetese - orchestrátor sa snaží z as-is prejsť do stavu to-be
    - Tým sa spustia tie reflektory
        - Updatne sa štruktúra DB
        - Vytvoria sa Eloquent modely
        - Vytvorí sa nový CRUD
        - atď.

## Čo myslím pod jednotlivými modulmi:

#### Auth

	- login
	- register
	- prihlasovanie cez google
	- rozdelit na BE / FE

#### Roles & Permissions

	- spatie ?
	- rozdelit na BE / FE

#### Settings

	- global settings
	- chcelo by to mozno tiez dorobit nejaky "editor" + JSON schemu tak ako pri crude, proste by som zadefinoval ake settingy existuju
	- z toho by vznikla nejaka JSON definicia
	- jej sucastou by mohla byt aj validacia
	- na jej zaklade by sa potom "vygenerovalo" GUIko pre editaciu tych settings

#### File Manager

	- hmm... ?
	- rozdelit na BE / FE

#### CRUD

	[X] struktura JSONu na definovanie entit a vztahov (MD dokument pre ľudí)
	[X] nejaka validacia toho JSONu - napr. JSON schema
	[ ] vizualny editor - web-based software (da sa zbuildit ako electrom, pwa, spa ...) na editovanie takych JSONov

	to je "Datamodel JSON definition", ale potom potrebujem nieco ako "Resource JSON definition" (datamodel je akoby databaza, resource su uz GUI entity ktore viem editovat, nemusi to byt jedna k jednej s databazou)
	tie "Resource" by mali definovat napr. validacne pravidla, nejake vizualne veci (ako bude vyzerat editovaci formular a pod.)
	takze to bude vlastne samostatna JSON schema nejaka ina ako ta "datamodel definicia", bude to skratka oddelene

	tool "datamodel validator" - na vstupe dostane datamodel (ten by mal obsahovat verziu specifikacie) a na vystupe povie ci je ok alebo nie. Ak nie je, optionally moze vratit aj nejaky zoznam "chyb"

	modul "database" - na zaklade toho JSONu musi upravit DB ("zmigrovat" zmeny)
	modul "models" - na zaklade toho JSONu musi vytvorit laravel modely
	modul "api" - na zaklade toho JSONu musi vystavit API endpointy (JSON:API alebo ine)
	modul "gui" - na zaklade toho JSONu musi vytvorit GUI CRUD pre editaciu danych entit

	cele to zautomazitovat (mozno cez nejake "eventy" ?)

---------------------------------

## Poznámky

#### Dobre napdy AI

	- Consider providing integrations or plugins for popular development tools, IDEs, or continuous integration platforms to enable seamless validation during the development process.

#### EXAMPLE Git Repos Structure (iba nápad)

	- *-specification - human readable specification
	- *-schema - computer-readable JSON Schema
	- js-package-* - any JS/TS package source code

	# Examples:

		- docs-schema-datamodel
		- json-schema-datamodel
		- npm-datamodel-validator
		- composer-settings
		- composer-settings-api

		- datamodel-specification
		- datamodel-schema
		- datamodel-validator-package
		- datamodel-validator-app

## Nápady

    - JSON dokument bude obsahovať charakteristiku systému (ako vyzerá databáza; ake tabulky, entity a pod.; napr. ake permissiony; ake settings; ake "resources"; ake "views"; ake "role" atd atd atd ...)
    - Nasledne nad tymito JSON dokumentami môžem spraviť nejaké tooly ktoré budú podľa toho generovať kód / genericky zobrazovať veci (tabulky, formuláre atď.)
    - Ako zakomponujem AI: Prikázať AI aby mi na základe vstupov generovala také JSONy ako potrebujem.
