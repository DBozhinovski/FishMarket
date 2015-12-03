import React from 'react';
import helpers from '../helpers';

const Fish = React.createClass({
  onButtonClick: function(){
    this.props.addToOrder(this.props.index);
  },
  render: function(){
    const details = this.props.details;
    const isAvailable = (details.status === 'available' ? true:false);
    const buttonText = (isAvailable ? 'Add To Order' : 'Sold Out!');

    return (
      <li className='menu-fish'>
        <img src={details.image} alt={details.name} />
        <h3 className='fish-name'>
          {details.name}
          <span className='price'>{helpers.formatPrice(details.price)}</span>
        </h3>
        <p>{details.desc}</p>
        <button disabled={!isAvailable} onClick={this.onButtonClick}>
          {buttonText}
        </button>
      </li>
    );
  }
});

export default Fish;
