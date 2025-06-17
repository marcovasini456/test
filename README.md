# Programma di Monitoraggio Meteo Torino

Questo programma Python monitora i dati meteorologici attuali per la città di Torino, Italia, utilizzando l'API di OpenWeatherMap. Salva i dati raccolti e tiene traccia dei valori massimi storici registrati localmente per diverse metriche (temperatura, umidità, pressione, ecc.).

## Funzionalità

- Recupera i dati meteorologici attuali per Torino (temperatura, temperatura percepita, pressione, umidità, velocità del vento, direzione del vento, raggi UV, nuvolosità, visibilità e descrizione del tempo).
- Salva ogni rilevazione in un file `dati_storici_torino.json`.
- Mantiene un registro dei valori massimi storici rilevati per le metriche principali all'interno dello stesso file.
- All'avvio, carica i dati storici e i massimi precedentemente salvati.
- Confronta i dati attuali con i massimi storici e segnala sul terminale se un nuovo massimo viene raggiunto.
- Aggiorna il file dei massimi storici con eventuali nuovi record.

## Prerequisiti

- Python 3.x
- Una API key valida da [OpenWeatherMap](https://openweathermap.org/api). È possibile utilizzare la "One Call API 3.0" che offre un piano gratuito con 1.000 chiamate al giorno.

## Installazione

1.  **Clona il repository (o scarica i file):**
    ```bash
    # Se stai usando git
    # git clone <url_del_tuo_repository>
    # cd <nome_del_repository>
    ```
    Assicurati di avere i file `main.py` e `requirements.txt` nella stessa directory.

2.  **Crea un ambiente virtuale (consigliato):**
    ```bash
    python -m venv venv
    # Su Windows
    # venv\Scripts\activate
    # Su macOS/Linux
    # source venv/bin/activate
    ```

3.  **Installa le dipendenze:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configura la tua API Key:**
    Crea un file chiamato `.env` nella stessa directory di `main.py`.
    Aggiungi la tua API key di OpenWeatherMap al file `.env` in questo formato:
    ```
    OPENWEATHER_API_KEY=LA_TUA_API_KEY_QUI
    ```
    Sostituisci `LA_TUA_API_KEY_QUI` con la tua chiave API effettiva.

## Esecuzione

Una volta completata l'installazione e la configurazione, esegui il programma con:

```bash
python main.py
```

Il programma stamperà i dati meteo attuali, segnalerà eventuali nuovi massimi storici e salverà i dati nel file `dati_storici_torino.json`.

## Struttura del file `dati_storici_torino.json`

Il file JSON è strutturato come segue:

```json
{
    "records": [
        {
            "timestamp": "2023-10-27T10:00:00.123Z",
            "temp": 15.5,
            "feels_like": 14.9,
            // ... altre metriche ...
        }
        // ... altri record ...
    ],
    "max_values": {
        "max_temp": 22.1,
        "max_temp_date": "2023-08-15T14:30:00Z",
        "max_humidity": 85,
        "max_humidity_date": "2023-09-10T08:00:00Z"
        // ... altre metriche massime ...
    }
}
```

- `records`: una lista di tutte le rilevazioni effettuate.
- `max_values`: un dizionario contenente i valori massimi registrati per ciascuna metrica monitorata e la data/ora in cui tale massimo è stato registrato.
