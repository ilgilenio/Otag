/*   _             _
 o  | |        o  | |                o
_   |/   __,  _   |/   __  _  __    _    __
 |  |   /  | / |  |   |_/ / |/  |  / |  /  \
 |_/|__/\_/|/  |_/|__/|__/  |   |_/  |_/\__/
		  /|
		  \| 	2016-2018 ilgilenio®
				Licensed under MIT

DİKKAT BU DOSYADAKİ BİLEŞENLER DENEYSELDİR
*/
O.define('UI',{
	Form:function(fields){
		let prop={send:function(){
			let r=Otag.req(this._endpoint,this.toData());
			['then','catch'].forEach(function(i){
				if(this['_'+i]){r[i](this['_'+i]);}
			},this)
			.then(this._then).catch(this._catch);
		}};
		['endpoint','then','catch'].forEach(function(i){
			prop[i]=function(j){
				this['_'+i]=j;
				return this;
			}
		});
		if(fields._sender){
			var f=Object.keys(fields).map(function(i){
				i=fields[i].dom();
				if(i.edit){i.edit();}
				return i;
			});
			f=fields[f[f.length-2]];
			if(f.TAGNAME=='input'){
				f.addEventListener('keyup',function(e){if(e.keyCode==13){
					this.parent._sender.onclick();
				}})
			}
			fields._sender.prop('onclick',function(){this.parent.send();});
		}
		return this.has(fields).prop(prop);
	},
	Text:function(large){
		return this.prop({
			_edit:(large?'textarea':'input').prop({
				onkeyup:function(e){
				let p=this.parent;
				if(e.keyCode==13&&this.parent.enter){
					this.parent.enter(this.value.trim());
				}
				if(p.onchange){p.onchange();}
				if(p.parent.onchange){p.parent.onchange();}
			}}),
			_spec:[
				['&','<','>','"','\''],
				['&amp;','&lt;','&gt;','&quot;','&#039;']
			],
			shadow:function(i,l){
				if(!l){this._edit.attr('placeholder',i);return this;}
				this._edit.t='placeholder';
				this._edit.Lang(i,l);
				return this;
			}
			,edit:function(){
				this.editing=1;
				this._edit.value=this.startText=
				this.innerHTML.replaceAll(this._spec[1],this._spec[0])
				return this.html(this._edit);
			}
			,control:function(i,cb){
				let k=this.prop({safe:0,rgx:new RegExp(i)});
				this._edit.addEventListener("keyup",function(e){
					k.safe=k.rgx.test(k._edit.value);
					if(e.keyCode==13&&k.safe&&this.next){this.next.click();}
					k._edit.Class('fail',k.safe).Class('safe',!k.safe);
					cb(k.safe?k._edit.value:false);
				});          
				return this.edit();                
			}
			,type:function(i){
				return this._edit.parent=this;
			}
			,value:function(i){
				if(i==null){
					return String(this._edit.value.trim().replaceAll(this._spec[0],this._spec[1]))
				}else{
					this._edit.value='';
					return this;
				}
			}
			,reset:function(){
				this._edit.value='';
				this._edit.focus();
			}
			,save:function(cancel){

				if(cancel){
					this.innerHTML=this.startText;
					return this;
				}
				this.innerHTML=this.value();
				this.editing=0;
				return this.startText!=this._edit.value?this._edit.value:-1;
			}
		});
	},
	Image:function(){
		return this.prop({
			set:Element.prototype.src
			,value:null
			,opt:{}
			,edit:function(size,onc){
				if(!this.img){
					var onchange=function(e){
						e.preventDefault();
						this.parent.onFile.call(this.parent,(e.dataTransfer||this).files);
					};
					this.prop({
						tmp:'img'.prop({
							size		:size
							,parent 	:this
							,onload		:function(){
								this.parent.ratio=this.width/this.height;
								this.parent.resize.bind(this)(this.size||240,this.size||240).then(this.cb);
								//URL.revokeObjectURL(this.src);
							}
						})
						,onclick:function(){
							this.input.click();
						}
						,input:'input'.prop({
							type:'file'
							,accept:'image/*'
							,parent:this
							,multiple:0
							,onchange:onchange
							,ondragover:function(e){
								e.preventDefault();
								e.dataTransfer.dropEffect = 'paste';
							}
							,ondrop:onchange
						})
						,onFile:function(files){
							var a=false,f=files[0];
							let s=this;
							s.style.backgroundImage="url("+(s.tmp._src=URL.createObjectURL(f))+")";
							s.value=s.tmp._src;
							console.log(files);
							if(['image/jpeg','image/png','image/tiff','image/svg','image/svg+xml'].indexOf(f.type)!=-1){
								s.changed=1;
								window.f=f;
								console.log(f);
								s.getRotation(f,function(i){
									console.log(i);
									s.opt.or=(i=i<3?0:(i<5?180:(i<7?90:-90)));
									s.style.transform='rotate('+i+'deg)';
								});
								if(s.onc){s.onc.call(s,s.tmp._src);}
							}
						}
						,cancel:function(){
							this.Class('editing',1);
							this.set(this.source);
							this.innerHTML="";
						}
						,save:function(cancel){
							this.Class('editing',1);
							if(cancel){
								this.set(this.source);
							}
							let s=this;
							return new Promise(function(res,rej){
								if(!s.changed){
									rej('not changed');
								}else{
									s.tmp.prop({
										cb:res,
										opt:s.opt,
										src:s.tmp._src
									});
								}
							});
							this.innerHTML="";
						}
						,getRotation:function (file, cb) {
							O.combine(new FileReader(),{
							onload:function(e) {
								var v = new DataView(e.target.result);
								if (v.getUint16(0, false) != 0xFFD8){ return cb(-2);}
								var length = v.byteLength, offset = 2;
								while (offset < length) {
									var marker = v.getUint16(offset, false);
									offset += 2;
									if (marker == 0xFFE1) {
										if (v.getUint32(offset += 2, false) != 0x45786966){return cb(-1);}
										var little = v.getUint16(offset += 6, false) == 0x4949;
										offset += v.getUint32(offset + 4, little);
										var tags = v.getUint16(offset, little);
										offset += 2;
										for (var i = 0; i < tags; i++){
											if (v.getUint16(offset + (i * 12), little) == 0x0112){
												return cb(v.getUint16(offset + (i * 12) + 8, little));
											}
										}
									}else if((marker & 0xFF00) != 0xFF00){
										break;
									}else{
										offset += v.getUint16(offset, false);
									}
								}
								return cb(-1);
							}}).readAsArrayBuffer(file);
						}
						//resize(maxHeight,maxWidth,callback)
						,resize:function(mH,mW,type) {
							if(typeof mW=="function"){
								cb=mW;
								mW=null;
							}
							var c = document.createElement("canvas"),r=this.ratio,w,h,
							ctx = c.getContext("2d");

							if(mW!=null&&mH!=null){
								if((r*mH)>mW){h=(w=mW)/r;}else{w=(h=mH)*r;}
							}else if(mW!=null){
								h=(w=mW)/r;
							}else if(mH!=null){
								w=(h=mH)*r;
							}
							if(Math.abs(this.opt.or)==90){
								c.width=h;
								c.height=w;
							}else{
								c.width=w;
								c.height=h;
							}
							let s =this;
							return new Promise(function(res,rej){
								ctx.rotate(s.opt.or*Math.PI/180);
								h=s.opt.or>0?-h:h;
								w=s.opt.or==0||s.opt.or==90?w:-w;
								console.log(s,w,h);
								if(s.opt.bg){
									ctx.fillStyle=s.opt.bg;
									ctx.fillRect(0,0,w,h);
								}
								ctx.drawImage(s.tmp, 0, 0,w,h);
								if(type=='blob'){
									c.toBlob(function(i){
										console.log(arguments);
										res(i);
									},'image/jpeg', 0.9);
								}else{
									res(c.toDataURL((s.opt.type||"image/jpeg"),(s.opt.quality||.8)));
								}
							});
						}
					});
				}
				return this.prop({onc:onc,size:size,changed:0}).has({i:this.input}).Class('editing');
			}
			
		})
	},
	List:function(_constructor){
		let k=this instanceof Element?this:this.init();


		Object.defineProperties(k,{
			data:{
				get:function(){
					return O.toArray(this.View).map(O.F.value('value'))
				},
				set:function(v){
					this.set(v);
				}
			},
			value:{
				get:function(){
					return O.toArray(this.View).map(O.F.value('oid'))
				},
				set:function(v){
					this.set(v);
				}
		}});
		Array.prototype.forEach(function(i){
			k[i]=function(){
				let Arr=this.value;
				return Arr[i].apply(Arr,arguments);
			}
		});
		return k.prop({
		clear:function(){
			this.View.forEach(function(i,j){i.destroy(j*50)});
			this.View=[];
			this.hash=0;
			return this;
		}
		,length:0
		,View:[]
		,opts:{}
		,set:function(data,push){
			//console.log(data)
			if(push){return this.push(data);}
			if(data.length==0){
				this.clear();}
			/*}
			let elems=this.View.map(function(i){return i.oid;}),
			l=elems.length,l2=data.length,s=this;*/
			var destr=0;
			if(!	this.opts.set){
				this.View.map(function(i,j){
					if(data.length){
						i.oid=data.shift();
					}else{
						i.destroy(destr+50);
						this[j]=null;
					}
				},this.View);
			}else{
				let s=this;
				this.value.forEach(function(i,j){
					if((ind=data.indexOf(i))==-1){
						if(id=data.shift()){
							s.View[j].oid=id;
						}else{
							s.View[j].destroy(destr+=50);
							s.View[j]=null;
						}
					}else{
						data[ind]=null;
					}
				});
			}
			return this.push(data);
		}
		,push:function(data){
			let s=this;
			this.View=this.View.filter(function(i){return i!=null})
			.concat(data.filter(function(i){return i!=null;}).map(function(i,j){
				let e=s._constructor(i,s.opts).prop({
					parent:s,
					oid:i
				}).Class("item").disp();
				s.appendChild(e);
				e.disp.bind(e).debounce(j*100)(1);
				return e;
			}));
			this.length=this.View.length;
			//this.store();
			return this;
		}
		,update:function(data){
			this.View.map(function(i,j){
				i.oid=data[j];
			})
			return this;
		}
		,filter:function(f,returnViewsOnly){
			let v=this.View.filter(f);
			this.innerHTML='';
			if(returnViewsOnly){return v;}
			return this.append(v);
		}
		,removed:function(data){
			let r;
			this.value=this.value.filter(O.F.diff([data]));
			this.length=this.View.length;
			return this;//.store();
		}
		,remove:function(data,anim){
			this.value=this.value.filter(O.F.diff([data]));
			//this.length=this.View.length;
			return this;//.store();
		}
		
		,_constructor:_constructor?(typeof _constructor=='function'?_constructor:(O.Model[_constructor]?O.Model[_constructor]:O.Model.Default)):O.Model.Default
		})
	},K:null,
	Array:function(_constructor){
		let elem=this instanceof Element?this:this.init();


		Object.defineProperties(elem,{
			value:{
				get:function(){
					return O.toArray(this.View).map(O.F.value('value'))
				},
				set:function(v){
					this.set(v);
				}
		}});
		Array.prototype.forEach(function(i){
			elem[i]=function(){
				let Arr=this.value;
				return Arr[i].apply(Arr,arguments);
			}
		});
		return elem.prop({
		clear:function(){
			this.View.forEach(function(i,j){i.destroy(j*50)});
			this.View=[];
			this.hash=0;
			return this;
		}
		,length:0
		,View:[]
		,opts:{}
		,set:function(data,push){
			//console.log(data)
			if(push){return this.push(data);}
			if(data.length==0){
				this.clear();}
			/*}
			let elems=this.View.map(function(i){return i.oid;}),
			l=elems.length,l2=data.length,s=this;*/
			var destr=0;
			if(!	this.opts.set){
				this.View.map(function(i,j){
					if(data.length){
						i.oid=data.shift();
					}else{
						i.destroy(destr+50);
						this[j]=null;
					}
				},this.View);
			}else{
				let s=this;
				this.value.forEach(function(i,j){
					if((ind=data.indexOf(i))==-1){
						if(id=data.shift()){
							s.View[j].oid=id;
						}else{
							s.View[j].destroy(destr+=50);
							s.View[j]=null;
						}
					}else{
						data[ind]=null;
					}
				});
			}
			return this.push(data);
		}
		,push:function(data){
			let s=this;
			this.View=this.View.filter(function(i){return i!=null})
			.concat(data.filter(function(i){return i!=null;}).map(function(i,j){
				let e=s._constructor(i,s.opts).prop({
					parent:s,
					oid:i
				}).Class("item").disp();
				s.appendChild(e);
				e.disp.bind(e).debounce(j*100)(1);
				return e;
			}));
			this.length=this.View.length;
			//this.store();
			return this;
		}
		,update:function(data){
			this.View.map(function(i,j){
				i.oid=data[j];
			})
			return this;
		}
		,filter:function(f,returnViewsOnly){
			let v=this.View.filter(f);
			this.innerHTML='';
			if(returnViewsOnly){return v;}
			return this.append(v);
		}
		,removed:function(data){
			let r;
			this.value=this.value.filter(O.F.diff([data]));
			this.length=this.View.length;
			return this;//.store();
		}
		,remove:function(data,anim){
			this.value=this.value.filter(O.F.diff([data]));
			//this.length=this.View.length;
			return this;//.store();
		}
		
		,_constructor:_constructor?(typeof _constructor=='function'?_constructor:(O.Model[_constructor]?O.Model[_constructor]:O.Model.Default)):O.Model.Default
		})
	},
	Bool:function(a,def){
		return this.Class('false',(def||false)).prop({
			onclick:function(){
				this.value=!this.value;
			}
			,value:def||false
		}).has({phr:'a.title'.set(a,1),button:".set"}).resp('value',function(v){
			this.Class('false',v)
		});
	},
	Boolean:function(def){
		def=Boolean(def=='false'?0:(def=='true'?1:Number(def)));
		return this.Class('false',(def||false)).prop({
			onclick:function(){
				this.set(!this.value);
			}
			,set:function(v){
				this.value=v=Boolean(v=='false'?0:(v=='true'?1:Number(v)));
				this.Class('false',v);
			}
			,value:def||false
		})
	},
	Tab:function(fields,_constructor,onfocus){
		let vi={},tabs={}
		,t=this.prop({
			ontouchstart:function(e){
				console.log(e,1);
				//this.View.map(function(){});this.scrollLeft
			}
		});
		(fields._||Object.keys(fields)).forEach(function(i,j){
			let v=(_constructor?_constructor():'').Class('vd').prop({aspect:fields[i],focus:function(){
				this.parent.focus(this.aspect)
			}});
			//v.style.backgroundColor='#A'+j+''+j;
			vi[fields[i]]=v;
			tabs[fields[i]]='a'.set(i,1).prop({
				href:'javascript:void(0)',
				onclick:function(){
					t.focus(fields[i]);
				},
				onfocus:function(){
					t.focus(fields[i]);
				}
			});
		});
		return t.has({
			tabs:'Tabs'.has(tabs)
			,vi:'View'.has(vi)
		}).prop('focus',function(sect){
			let v;
			this.V('vi').scrollTo(v=this.V('vi:'+sect),'X');
			if(onfocus){onfocus.call(v,sect);}
			O.toArray(this.V('tabs:')).forEach(O.F.each('Class',['on',1]));
			this.V('tabs:'+sect).Class('on');

		});
	}
});