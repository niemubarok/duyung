import hid
import requests
from prompt_toolkit import prompt

key_map = {
    4: "a", 5: "b", 6: "c", 7: "d", 8: "e", 9: "f", 10: "g", 11: "h", 12: "i", 13: "j",
    14: "k", 15: "l", 16: "m", 17: "n", 18: "o", 19: "p", 20: "q", 21: "r", 22: "s", 23: "t",
    24: "u", 25: "v", 26: "w", 27: "x", 28: "y", 29: "z", 30: "1", 31: "2", 32: "3", 33: "4",
    34: "5", 35: "6", 36: "7", 37: "8", 38: "9", 39: "0", 40: "Enter", 41: "Escape", 42: "Backspace",
    43: "Tab", 44: "Space", 45: "-", 46: "=", 47: "[", 48: "]", 49: "\\", 51: ";", 52: "'", 53: "`",
    54: ",", 55: ".", 56: "/"
    # Tambahkan lebih banyak sesuai kebutuhan
}

def select_device():
    devices = hid.enumerate()
    if not devices:
        print("No HID devices found.")
        return

    print("Available HID devices:")
    for index, device in enumerate(devices):
        print(f"{index + 1}. Path: {device['path']}, Manufacturer: {device['manufacturer_string']}, Product: {device['product_string']}")

    try:
        selected_device_index = int(prompt("Enter the number of the device you want to use: "))
        if 1 <= selected_device_index <= len(devices):
            selected_device = devices[selected_device_index - 1]
            listen_to_device(selected_device)
        else:
            print("Invalid selection.")
    except ValueError:
        print("Please enter a valid number.")

def listen_to_device(device_info):
    device = hid.device()
    device.open_path(device_info['path'])
    print(f"Listening to device: {device_info['product_string']}")
    data_barcode = []

    def on_data(data):
        nonlocal data_barcode
        keyCode = data[2]
        key = key_map.get(keyCode, None)
        if not key:
            return

        if data_barcode and key == "Enter":
            make_api_request(''.join(data_barcode))
            data_barcode = []
        else:
            data_barcode.append(key)
            print("dataBarcode:", ''.join(data_barcode))

    try:
        while True:
            data = device.read(64)
            on_data(data)
    except KeyboardInterrupt:
        print("Stopped listening to device.")
    except Exception as e:
        print(f"Device error: {e}")
    finally:
        device.close()

def make_api_request(data_barcode):
    print("Barcode:", data_barcode)
    url = "http://127.0.0.1:3333/api/ingate/barcode"
    try:
        response = requests.post(url, json={"barcode": data_barcode})
        print("Data from API:", response.json())
    except Exception as e:
        print(f"Error fetching data from API: {e}")

if __name__ == "__main__":
    select_device()
