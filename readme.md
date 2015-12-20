# Sphero-server
  
websocketとnode.jsで、Fx0などのbluetooth非対応デバイス、IoTデバイスからspheroへアクセスできるようにする。  
  
## 使いかた
  
あらかじめ、node.jsをインストールしておく。  
このファイルがあるディレクトリで、  
```bash
npm i
```
  
public_html/settings.jsonを編集。  
port: サーバーのポート  
ip: サーバーのIPアドレス（プライベートIP）  
sphero_serialport: Spheroのシリアルポート。Windowsの場合、[こちら](http://fabble.cc/shundroid/spherowin8-1)を参照。  
  
```bash
node main.js
```
ファイアーウォールの許可が出たら、許可する。  
connected spheroと表示された後、  
Fx0などのbluetooth非対応デバイスから、`http://<サーバーのIPアドレス>:<ポート>/`にアクセス。  
textboxで、`color:red`や、`color:green`などと入力してみると、色が変わる！！  
# Sphero-Server 
