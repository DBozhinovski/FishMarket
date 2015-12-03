import React from 'react';
import AddFishForm from './AddFishForm';
import Firebase from 'firebase';

const ref = new Firebase('https://fiery-fire-913.firebaseio.com/');

const Inventory = React.createClass({
  getInitialState: function(){
    return {
      uid: ''
    };
  },
  authenticate: function(provider){
    console.log('Trying to auth with', provider);
    ref.authWithOAuthPopup(provider, this.authHandler);
  },
  authHandler: function(err, authData){
    if(err){
      console.error(err);
      return;
    } else {
      localStorage.setItem('token', authData.token);

      const storeRef = ref.child(this.props.params.storeId);
      storeRef.on('value', snapshot => {
        const data = snapshot.val() || {};

        if(!data.owner){
          storeRef.set({
            owner: authData.uid
          });
        }

        this.setState({
          uid: authData.uid,
          owner: data.owner || authData.uid
        });
      });
    }
  },
  logout: function(){
    ref.unauth();
    localStorage.removeItem('token');
    this.setState({
      uid: null
    });
  },
  componentWillMount: function(){
    const token = localStorage.getItem('token');
    if(token){
      ref.authWithCustomToken(token, this.authHandler);
    }
  },
  renderLogin: function(){
    return (
      <nav className='login'>
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className='github'
          onClick={this.authenticate.bind(this, 'github')}>
          Log in with GitHub
        </button>
        <button className='facebook'
          onClick={this.authenticate.bind(this, 'facebook')}>
          Log in with Facebook
        </button>
        <button className='twitter'
          onClick={this.authenticate.bind(this, 'twitter')}>
          Log in with Twitter
        </button>
      </nav>
    );
  },
  renderInventory: function(key){
    const {linkState} = this.props;

    return (
      <div className='fish-edit' key={key}>
        <input type='text' valueLink={linkState('fishes.' + key + '.name')} />
        <input type='text' valueLink={linkState('fishes.' + key + '.price')} />
        <select valueLink={linkState('fishes.' + key + '.status')}>
          <option value='unavailable'>Sold Out!</option>
          <option value='available'>Fresh!</option>
        </select>
        <textarea valueLink={linkState('fishes.' + key + '.desc')}></textarea>
        <input type='text' valueLink={linkState('fishes.' + key + '.image')} />
        <button onClick={this.props.removeFish.bind(null, key)}>
          Remove Fish
        </button>
      </div>
    );
  },
  render: function(){
    const logoutButton = <button onClick={this.logout}>Log Out!</button>;

    if(!this.state.uid){
      return (
        <div>{this.renderLogin()}</div>
      );
    }

    if(this.state.uid !== this.state.owner){
      return (
        <div>
          <p>Sorry, you aren't the owner of this store.</p>
          {logoutButton}
        </div>
      );
    }

    return (
      <div>
        <h2>Inventory</h2>
        {logoutButton}
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm {...this.props} />
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    );
  },
  propTypes: {
    addFish: React.PropTypes.func.isRequired,
    loadSamples: React.PropTypes.func.isRequired,
    fishes: React.PropTypes.object.isRequired,
    linkState: React.PropTypes.func.isRequired,
    removeFish: React.PropTypes.func.isRequired
  }
});

export default Inventory;
