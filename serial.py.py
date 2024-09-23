import serial
import time
import datetime

# 시리얼 포트 설정
# Windows에서는 'COM3', 'COM4' 등으로, 
# Mac에서는 '/dev/tty.usbserial-*', 
# Linux에서는 '/dev/ttyUSB0' 등으로 변경해야 할 수 있습니다.
print("프로그램 시작")
ser = serial.Serial('COM8', 9600, timeout=1)

def read_sensor():
    # 현재 날짜와 시간으로 파일 이름 생성
    filename = datetime.datetime.now().strftime("%Y%m%d_%H%M%S") + "_sensor_data.txt"
    
    with open(filename, 'w') as file:
        while True:
            if ser.in_waiting > 0:
                # 현재 시간 가져오기
                current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                
                # 센서 데이터 읽기
                line = ser.readline().decode('utf-8').rstrip()
                
                # 시간과 센서 값을 합쳐서 출력 및 파일에 쓰기
                output = f"{current_time} - sensor value: {line}"
                print(output)
                file.write(output + '\n')
                file.flush()  # 즉시 파일에 쓰기
            
            time.sleep(1)

if __name__ == "__main__":
    try:
        read_sensor()
    except KeyboardInterrupt:
        print("프로그램을 종료합니다.")
    finally:
        ser.close()