import React, {useState} from 'react';
import "./Description.css";
import description1 from "../../images/description/description1.png";
import description2 from "../../images/description/description2.png";
import description3 from "../../images/description/description3.png";
import description4 from "../../images/description/description4.png";

const Description = () => {
    return (
        <div className="description">
            {/*Блок опису зі стрічки головної сторінки*/}
            <div className="description1">
                <div className="dsc_image">
                    <img src={description1} alt="description1_img"/>
                </div>
                {/*Текст для опису зі стрічки головної сторінки*/}
                <div className="dsc_text">
                    <h2>Легко керуйте робочим простором</h2>
                    <br/>
                    <h3>Система автоматично фіксує пересування робітників між
                        робочими
                        кімнатами, забезпечуючи комфорт та ефективність. Ваш офіс - ваш комфорт!</h3>
                </div>
            </div>


            <div className="description2">
                <div className="dsc_text">
                    <h2>Ідеальна організація робочого часу</h2>
                    <br/>
                    <h3>Миттєве виявлення непрацездатності та контроль за робочим
                        часом. Ми визначаємо стандарти пунктуальності для вашого успіху!</h3>
                </div>
                <div className="dsc_image">
                    <img src={description2} alt="description1"/>
                </div>
            </div>


            <div className="description3">
                <div className="dsc_image">
                    <img src={description3} alt="description3"/>
                </div>
                <div className="dsc_text">
                    <h2>Максимальний рівень безпеки на роботі</h2>
                    <br/>
                    <h3>Забудьте про несанкціоновані переміщення. Наша система не тільки контролює, але і попереджає
                        порушення. Виберіть надійність та потужність!</h3>
                </div>
            </div>

            <div className="description4">
                <div className="dsc_image">
                    <img src={description4} alt="description4"/>
                </div>
                <br/>
                <div className="dsc_text">
                    <h2>Чому варто обрати нас?</h2>
                    <br/>
                    <h3>Наший легкий інтерфейс, висока ефективність та надійність - це лише кілька переваг, які роблять
                        нас найкращим вибором для вашого бізнесу. Збільште продуктивність та забезпечте контроль з нашою
                        системою!</h3>
                </div>
            </div>
        </div>
    );
}

export default Description;