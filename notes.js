const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);

const flagForCreate = 'create';
const flagForRead = 'read';
const flagForRemove = 'remove';
const flagForUpdate = 'update';
const flagForList = 'list';

const command =  process.argv[2];
const title =  process.argv[3];
const content =  process.argv[4];

switch(command){
	case flagForCreate:
		create(title, content);
		break;
	case flagForRead :
		read(title);
		break;
	case flagForRemove: 
		remove(title);
		break;
	case flagForList: 
		list();
		break;
	case flagForUpdate: 
		update(title, content);
		break;
	default: 
		console.log('error')
	break;
}

function create(title, content){
	load((error, notes) => {
		if(error) return done(error);
		var search = notes.filter(item => {
			return item.title == title;
		})
		if(search.length){console.log('Запись с таким заголовком уже имеется'); return}
		notes.push({title, content});
		save(notes, () => {console.log("Запиcь создана")
	})
})
}

function update(title, content){
	load((error, notes) => {
		if(error) return done(error);
		let index = 0;
		let objForUpdate = notes.filter((item, i) => {
		if(item.title == title){
			index = i;
				return true;
			}
		});
		if(!objForUpdate.length){console.log('Записи с таким заголовком не существует'); return}
		notes.splice(index, 1, {title, content})
		save(notes, () => {console.log("Запиcь изменена")})

})
}

function remove(title){
	load((error, notes) => {
		let index = 0;
		let objForDelete = notes.filter((item, i) => {
		if(item.title == title){
			index = i;
				return true;
			}
		});
		if(!objForDelete.length){console.log('Записи с таким заголовком не существует'); return}
		notes.splice(index, 1)
		save(notes, () => {console.log("Запиcь  удалена")})
	})
}

function list(){
	load((error, notes) => {
		notes.forEach((item, index) => {
		console.log(`${++index}.${item.title}`)
		})
	})
}

function read(title){
	load((error, notes) => {
		var search = notes.find(item => {
			return item.title == title;
		})
		if(!search){ console.log('Такой записи не найдено'); return;}
		console.log(`#${search.title}\n\n${search.content}\n`)
	});
}

function load(done){
	fs.readFile('list.json', (error, data) => {
		if(error){
			if(error.code == 'ENOENT'){
				return done(null, [])
			}else{
				return done(error)
			}
		}
		try{
			const notes = JSON.parse(data);
			done(null, notes)
		}catch(error){
			done(error)
		}
	})
}

function save(notes,done){
	try{
		const json = JSON.stringify(notes);
		fs.writeFile('list.json', json, error => {
			if(error) return done(error);
			done()
		})
	}catch(error){
		done(error)
	}
}