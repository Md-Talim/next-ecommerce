import Image from 'next/image';

interface Props {
  id: string;
  name: string;
  image: string;
  price: number | null;
}

const Product = ({ name, image, price }: Props) => {
  return (
    <div>
      <Image src={image} alt={name} width={200} height={200} />
      <h2>{name}</h2>
      {price ? <p>${price}</p> : <p>Free</p>}
    </div>
  );
};

export default Product;
