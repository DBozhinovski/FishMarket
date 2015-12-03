import React from 'react';
import helpers from '../helpers';
import CSSTransitionGroup from 'react-addons-css-transition-group';


let Order = React.createClass({
  renderOrder: function(key){
    var fish = this.props.fishes[key];
    var count = this.props.order[key];
    var removeButton =
      <button onClick={this.props.removeFromOrder.bind(null, key)}>
        &times;
      </button>;

    if(!fish){
      return <li key={key}>Sorry, fish no longer available! {removeButton}</li>;
    }

    return (
      <li key={key}>
        <CSSTransitionGroup component='span' transitionName='count'
          transitionLeaveTimeout={250} transitionEnterTimeout={250}>
          <span key={count}>
            {count}
          </span>
        </CSSTransitionGroup>
        lbs {fish.name} {removeButton}
        <span className='price'>
          {helpers.formatPrice(count * fish.price)}
        </span>
      </li>
    );
  },
  render: function(){
    const orderIds = Object.keys(this.props.order);
    const total = orderIds.reduce((prevTotal, key) => {
      const fish = this.props.fishes[key];
      const count = this.props.order[key];

      const isAvailable = fish && fish.status === 'available';

      if(fish && isAvailable){
        return prevTotal + (count * parseInt(fish.price) || 0);
      }

      return prevTotal;
    }, 0);

    return (
      <div className='order-wrap'>
        <h2 className='order-title'>Your Order</h2>
        <CSSTransitionGroup className='order' component='ul'
          transitionName='order' transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
          >
          {orderIds.map(this.renderOrder)}
          <li className='total'>
            <strong>Total:</strong>
            {helpers.formatPrice(total)}
          </li>
        </CSSTransitionGroup>
      </div>
    );
  },
  propTypes: {
    fishes: React.PropTypes.object.isRequired,
    order: React.PropTypes.object.isRequired,
    removeFromOrder: React.PropTypes.func.isRequired
  }
});

export default Order;
