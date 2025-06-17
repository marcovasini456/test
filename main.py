import requests
import json
import os
from datetime import datetime
from dotenv import load_dotenv

# --- Configurazione ---
DATA_FILE = "dati_storici_torino.json"
TORINO_LAT = 45.0703
TORINO_LON = 7.6869

def load_api_key():
    """Carica la API key di OpenWeatherMap da un file .env."""
    load_dotenv()
    api_key = os.getenv("OPENWEATHER_API_KEY")
    if not api_key:
        print("Errore: API key non trovata. Assicurati di aver creato un file .env con OPENWEATHER_API_KEY=LA_TUA_API_KEY")
        return None
    return api_key

def get_weather_data(api_key, lat, lon):
    """Recupera i dati meteorologici attuali da OpenWeatherMap."""
    if not api_key:
        return None

    url = f"https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&appid={api_key}&units=metric&lang=it"

    try:
        response = requests.get(url)
        response.raise_for_status()  # Solleva un'eccezione per errori HTTP (4xx o 5xx)
        data = response.json()
        return data
    except requests.exceptions.HTTPError as http_err:
        print(f"Errore HTTP durante la richiesta API: {http_err}")
        if response.status_code == 401:
            print("Controlla la validità della tua API key e i permessi del tuo piano.")
    except requests.exceptions.RequestException as req_err:
        print(f"Errore durante la richiesta API: {req_err}")
    except json.JSONDecodeError:
        print("Errore: Impossibile decodificare la risposta JSON dall'API.")
    return None

def load_historical_data(file_path):
    """Carica i dati storici da un file JSON."""
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError:
            print(f"Attenzione: il file {file_path} contiene JSON non valido. Verrà sovrascritto se si salvano nuovi dati.")
            return {"records": [], "max_values": {}}
        except Exception as e:
            print(f"Errore durante il caricamento di {file_path}: {e}. Verrà trattato come vuoto.")
            return {"records": [], "max_values": {}}
    return {"records": [], "max_values": {}} # Struttura di default se il file non esiste

def save_data(file_path, data):
    """Salva i dati nel file JSON."""
    try:
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"Dati salvati correttamente in {file_path}")
    except Exception as e:
        print(f"Errore durante il salvataggio dei dati in {file_path}: {e}")

def analyze_and_notify(current_weather, historical_data):
    """
    Analizza i dati correnti, confrontali con i massimi storici
    e notifica se vengono superati. Aggiorna i massimi storici.
    """
    if not current_weather or 'current' not in current_weather:
        print("Dati meteo attuali non disponibili per l'analisi.")
        return historical_data

    current_data = current_weather['current']
    now_iso = datetime.utcnow().isoformat()

    # Estrai i dati di interesse (puoi espandere questa lista)
    data_point = {
        "timestamp": now_iso,
        "temp": current_data.get('temp'),
        "feels_like": current_data.get('feels_like'),
        "pressure": current_data.get('pressure'),
        "humidity": current_data.get('humidity'),
        "wind_speed": current_data.get('wind_speed'),
        "wind_deg": current_data.get('wind_deg'),
        "uvi": current_data.get('uvi'),
        "clouds": current_data.get('clouds'),
        "visibility": current_data.get('visibility'),
        "weather_description": current_data['weather'][0].get('description') if current_data.get('weather') else None
    }

    # Rimuovi eventuali chiavi con valore None per pulizia
    data_point = {k: v for k, v in data_point.items() if v is not None}

    historical_data["records"].append(data_point)
    print(f"\nDati attuali ({datetime.now().strftime('%Y-%m-%d %H:%M:%S')}):")
    for key, value in data_point.items():
        if key != "timestamp":
            print(f"- {key.replace('_', ' ').capitalize()}: {value}")

    # --- Confronto con i massimi storici ---
    max_values = historical_data.get("max_values", {})
    new_records_found = False

    # Metriche da monitorare per i massimi (e minimi se rilevante, es. temp_min)
    # Per semplicità, ora monitoriamo solo i massimi.
    metrics_to_check = ['temp', 'feels_like', 'pressure', 'humidity', 'wind_speed', 'uvi']

    for metric in metrics_to_check:
        current_value = data_point.get(metric)
        if current_value is not None:
            max_metric_key = f"max_{metric}"
            max_metric_date_key = f"max_{metric}_date"

            if current_value > max_values.get(max_metric_key, float('-inf')):
                print(f"!!! NUOVO MASSIMO STORICO per {metric.replace('_', ' ').capitalize()}: {current_value} !!! (Precedente: {max_values.get(max_metric_key)})" )
                max_values[max_metric_key] = current_value
                max_values[max_metric_date_key] = now_iso
                new_records_found = True
            elif max_metric_key not in max_values : # Se è il primo dato per questa metrica
                 max_values[max_metric_key] = current_value
                 max_values[max_metric_date_key] = now_iso


    if new_records_found:
        print("\n--- Riepilogo Massimi Storici Aggiornati ---")
        for key, value in max_values.items():
            if key.startswith("max_") and not key.endswith("_date"):
                 metric_name = key.replace("max_", "").replace("_"," ").capitalize()
                 date_val = max_values.get(f"{key}_date", "N/D")
                 try:
                     # Prova a formattare la data se è una stringa ISO valida
                     formatted_date = datetime.fromisoformat(date_val.replace('Z', '+00:00')).strftime('%Y-%m-%d %H:%M:%S UTC')
                 except:
                     formatted_date = date_val # Lascia la data com'è se non formattabile
                 print(f"- {metric_name}: {value} (registrato il {formatted_date})")
    else:
        print("\nNessun nuovo massimo storico registrato in questa sessione.")
        if not max_values:
            print("Database dei massimi storici ancora vuoto.")


    historical_data["max_values"] = max_values
    return historical_data


def main():
    """Funzione principale del programma."""
    api_key = load_api_key()
    if not api_key:
        return

    print(f"Caricamento dati storici da {DATA_FILE}...")
    historical_data = load_historical_data(DATA_FILE)

    print("Recupero dati meteo attuali per Torino...")
    current_weather = get_weather_data(api_key, TORINO_LAT, TORINO_LON)

    if current_weather:
        # print("\nDati API ricevuti:")
        # print(json.dumps(current_weather, indent=2, ensure_ascii=False)) # Debug: stampa tutti i dati ricevuti

        updated_historical_data = analyze_and_notify(current_weather, historical_data)
        save_data(DATA_FILE, updated_historical_data)
    else:
        print("Non è stato possibile recuperare i dati meteo attuali. Il programma terminerà.")

    print("\nEsecuzione terminata.")

if __name__ == "__main__":
    main()
