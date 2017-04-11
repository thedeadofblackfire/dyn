/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
		app.device.initialize();
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.device = {
  self: this,
  plugin: null,
  userInfos: null,
  initOK: false,
  discoveryOK: false,
  connectOK: false,
  initialize: function() {
	  app.device.plugin = cordova.plugins.IHealth;
  },
  tracelog: function(result){
	//console.log(result);
    //alert(result);
  },
  init: function(){
    var self = this;
    console.log('CALLING PLUGIN: INIT');
    self.initOK=true;
    self.plugin.init(function(result){
      console.log("INIT RESULT",JSON.stringify(result));
      self.tracelog(JSON.stringify(result));
    },function(error){
      console.log("INIT ERROR",JSON.stringify(error));
      self.tracelog(JSON.stringify(error));
    });
  },
  startDiscovery: function(){
    console.log(app.device.plugin);
    console.log('CALLING PLUGIN: START DISCOVERY');
    var self=this;
    self.plugin.registerOnDiscoveryFinished(function(result){
      console.log('ON DISCOVERY FINISHED RESULT',JSON.stringify(result));
      self.tracelog(JSON.stringify(result));
    },function(error){
      console.log('ON DISCOVERY FINISHED ERROR',JSON.stringify(error));
      self.tracelog(JSON.stringify(error));
    });
    self.plugin.registerOnScannedDevice(function(result){
      console.log('ON SCANNED DEVICE RESULT',JSON.stringify(result));
      self.tracelog(JSON.stringify(result));
	   if (Object.keys(result).length > 0) self.userInfos = result;
    },function(error){
      console.log('ON SCANNED DEVICE ERROR',JSON.stringify(error));
      self.tracelog(JSON.stringify(error));
    });
    self.plugin.startDiscovery('AM4',function(result){
      console.log('START DISCOVERY RESULT',JSON.stringify(result));
      self.tracelog(JSON.stringify(result));
      if (Object.keys(result).length > 0) self.userInfos = result; // {"model":"AM4","address":"004D3207D3B8"}
      self.discoveryOK=true;
    },function(error){
      console.log('START DISCOVERY ERROR',JSON.stringify(error));
      self.tracelog(JSON.stringify(error));
    });
  },
  stopDiscovery: function(){
    var self = this;
    self.plugin.stopDiscovery(function(result){
      console.log('STOP DISCOVERY RESULT',JSON.stringify(result));
      self.tracelog(JSON.stringify(result));
      self.discoveryOK=false;
    },function(error){
      console.log('STOP DISCOVERY ERROR',JSON.stringify(error));
      self.tracelog(JSON.stringify(error));
    });
  },
  connect: function(){
    var self = this;
    if(self.userInfos){
		//self.plugin.connect(self.userInfos.address,function(result){ // old		
	  // iHealthDeviceLabs-Android-master/api-docs/index.html
      self.plugin.connect('TYPE_'+self.userInfos.model, self.userInfos.address,function(result){
        console.log('DEVICE CONNECT RESULT',JSON.stringify(result));
        self.tracelog(JSON.stringify(result));
        self.connectOK=true;
      },function(error){
        console.log('DEVICE CONNECT ERROR',JSON.stringify(error));
        self.tracelog(JSON.stringify(error));
      })
    }else{
      console.error('NO DEVICE SCANNED');
    }
  },
  disconnect: function(){
    var self = this;
    if(self.userInfos){
      self.plugin.disconnect(self.userInfos.model,self.userInfos.address,function(result){
        console.log('DEVICE DISCONNECT RESULT',JSON.stringify(result));
        self.tracelog(JSON.stringify(result));
        self.userInfos=null;
        self.connectOK=false;
      },function(error){
        console.log('DEVICE DISCONNECT ERROR',JSON.stringify(error));
        self.tracelog(JSON.stringify(error));
      })
    }else{
      console.error('NO DEVICE SCANNED');
    }
  },
  getActivityData: function(){
    var self = this;
    if(self.userInfos){
      self.plugin.getActivityData(self.userInfos.model,self.userInfos.address,function(result){
        console.log('DEVICE ACTIVITY DATA RESULT',JSON.stringify(result));
        self.tracelog(JSON.stringify(result));
      },function(error){
        console.log('DEVICE ACTIVITY DATA ERROR',JSON.stringify(error));
        self.tracelog(JSON.stringify(error));
      })
    }else{
      console.error('NO DEVICE SCANNED');
    }
  },
  getSleepData: function(){
    var self = this;
    if(self.userInfos){
      self.plugin.getSleepData(self.userInfos.model,self.userInfos.address,function(result){
        console.log('DEVICE ACTIVITY DATA RESULT',JSON.stringify(result));
        self.tracelog(JSON.stringify(result));
      },function(error){
        console.log('DEVICE ACTIVITY DATA ERROR',JSON.stringify(error));
        self.tracelog(JSON.stringify(error));
      })
    }else{
      console.error('NO DEVICE SCANNED');
    }
  },
  endToEnd: function(){
    var self = this;
    console.log('INIT...');
    self.plugin.init(function(result){
      self.tracelog(JSON.stringify(result));
      console.log("INIT RESULT",JSON.stringify(result));
      console.log('DISCOVERY...');
      self.plugin.startDiscovery('AM4',function(result){
        self.tracelog(JSON.stringify(result));
        var userInfos = result;
        console.log('DISCOVERY RESULT',JSON.stringify(result));
        console.log('STOP DISCOVERY...');
        self.plugin.stopDiscovery(function(result){
          self.tracelog(JSON.stringify(result));
          console.log('STOP DISCOVERY RESULT',JSON.stringify(result));
          console.log('CONNECTING TO',userInfos,"...");
          self.plugin.connect(userInfos.address,function(result){
            self.tracelog(JSON.stringify(result));
            console.log('DEVICE CONNECT RESULT',JSON.stringify(result));
            console.log('READING ACTIVITY DATA...');
            self.plugin.getActivityData(userInfos.model,userInfos.address,function(result){
              self.tracelog(JSON.stringify(result));
              console.log('DEVICE ACTIVITY DATA RESULT',JSON.stringify(result));
              console.log('READING SLEEP DATA...');
              self.plugin.getSleepData(userInfos.model,userInfos.address,function(result){
                self.tracelog(JSON.stringify(result));
                console.log('DEVICE SLEEP DATA RESULT',JSON.stringify(result));
                console.log('DISCONNECTING...');
                self.plugin.disconnect(userInfos.model,userInfos.address,function(result){
                  self.tracelog(JSON.stringify(result));
                  console.log('DISCONNECT RESULT',JSON.stringify(result));
                },function(error){
                  self.tracelog("ERROR: "+JSON.stringify(error));
                  console.log('DEVICE DISCONNECT ERROR',JSON.stringify(error));
                });             
              },function(error){
                self.tracelog("ERROR: "+JSON.stringify(error));
                console.log('DEVICE SLEEP DATA ERROR',JSON.stringify(error));
              })              
            },function(error){
              self.tracelog("ERROR: "+JSON.stringify(error));
              console.log('DEVICE ACTIVITY DATA ERROR',JSON.stringify(error));
            })
          },function(error){
            self.tracelog("ERROR: "+JSON.stringify(error));
            console.log('DEVICE CONNECT ERROR',JSON.stringify(error));
          })          
        },function(error){
          self.tracelog("ERROR: "+JSON.stringify(error));
          console.log('STOP DISCOVERY ERROR',JSON.stringify(error));
        });
      },function(error){
        self.tracelog("ERROR: "+JSON.stringify(error));
        console.log('DISCOVERY ERROR',JSON.stringify(error));
      });
    },function(error){
      self.tracelog("ERROR: "+JSON.stringify(error));
      console.log("INIT ERROR",JSON.stringify(error));
    });
  }
	
};


app.initialize();