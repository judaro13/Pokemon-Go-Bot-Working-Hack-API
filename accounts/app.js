function pad (str, max) {
  str = str.toString() || 0;
  return str.length < max ? pad("0" + str, max) : str;
}

Array.prototype.keySort = function(key, desc){
  this.sort(function(a, b) {
    var result = desc ? (a[key] < b[key]) : (a[key] > b[key]);
    return result ? 1 : -1;
  });
  return this;
}

Vue.component('items', {
  template: '#items',
  props: {
    items: Array
  }
});

Vue.component('item', {
  template: '#item',
  props: {
    id: Number,
    count: Number
  },
  computed: {
    itemimg: function() {
      return '/img/items/' + this.id + '.png'
    }
  }
});


Vue.component('pokemon', {
  template: '#pokemon',
  props: {
    pokemon_id: Number,
    cp: Number,
    stamina: Number,
    stamina_max: Number,
    creation_time_ms: Number
  },
  computed: {
    name: function(){
      return poke_name(this.pokemon_id);
    },
    animation: function() {
      return '/img/pokemon/' + pad(this.pokemon_id, 3) + '.gif'
    }
  }
});


Vue.component('mapita', {
  template: '#mapbox',
  props: {
    cords: Array
  },
  ready: function(){
    // var self = this;
    // console.log(self.cords);
    // mapboxgl.accessToken = 'pk.eyJ1IjoiYW5nZWxib3R0byIsImEiOiJ3UTJiREljIn0.dsUsSUHrSHUKBpGwb4TLGg';
    // var map = new mapboxgl.Map({
    //   container: 'map',
    //   style: 'mapbox://styles/mapbox/streets-v9',
    //   zoom: 13,
    //   center: self.cords
    // });
    //
    // var el = document.createElement('button');
    // el.className = 'marker';
    // el.style.backgroundColor = 'red';
    // el.style.borderRadius = '50%';
    // el.style.border = 'none';
    // el.style.width = '10px';
    // el.style.height = '10px';
    //
    // new mapboxgl.Marker(el).setLngLat(self.cords).addTo(map);
  }
});

Vue.component('pokemons', {
  template: '#pokemons',
  props: {
    pokemons: Array
  },
  method: {
    fetch_data: function(){
      this.$parent.fetch_data()
    }
  },
  data: function(){
    return {
      order: 'creation_time_ms',
      poke_name: ''
    }
  }
});

Vue.component('app', {
  template: '#app',
  data: function(){
    return {
      pokemons: this.$parent.pokemons,
      items: this.$parent.items,
      cords: this.$parent.cords
    }
  }
});

Vue.config.devtools = true;

new Vue({
  el: 'body',
  ready: function(){
    var self= this;
    self.fetch_data()
  },
  methods: {
    fetch_data: function(params){
      console.log(window);
      console.log('fetch data')
      var self = this;
      var request = new Request('/angelbotto@gmail.com.json', {
        method: 'GET',
      });

      function parseResult(element, index, array) {
        if(element.inventory_item_data['item'] != undefined ){
          var item = element.inventory_item_data.item;
          self.items.push(item);
        }
        if(element.inventory_item_data['pokemon_data'] != undefined ){
          var pokemon = element.inventory_item_data.pokemon_data
          if(pokemon['pokemon_id'] != undefined) {
            self.pokemons.push(pokemon);
          }
        }
      }

      fetch(request).then(function(response) {
        return response.json()
      }).then(function(data){
        var result = data.GET_INVENTORY.inventory_delta.inventory_items;
        result.forEach(parseResult);
        self.cords.push(data.lng);
        self.cords.push(data.lat);
      });
    }
  },

  data: function(){
    return {
      pokemons: [],
      items:    [],
      cords:    []
    }
  }
});
