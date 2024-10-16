// App.js

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const FormContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background: linear-gradient(white, #f8cdd9);
`;

const FormField = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
`;

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    birthDate: "",
    country: "",
    gender: "",
    marketingConsent: false,
    termsConsent: false,
  });

  const [countries, setCountries] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const formattedCountries = response.data.map((country) => ({
          name: country.name.common,
          flag: country.flags.svg,
        }));
        setCountries(formattedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const { firstName, lastName, email, password, confirmPassword, age, birthDate, country, termsConsent } = formData;

    const nameRegex = /^[a-zA-Z]{2,}$/;
    if (!nameRegex.test(firstName)) newErrors.firstName = "Imię musi zawierać co najmniej 2 litery.";
    if (!nameRegex.test(lastName)) newErrors.lastName = "Nazwisko musi zawierać co najmniej 2 litery.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) newErrors.email = "Podaj poprawny adres email.";

    const passwordRegex = /^(?=.*\d.*\d)(?=.*[!@#$%^&*].*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) newErrors.password = "Hasło musi mieć co najmniej 8 znaków, 2 cyfry i 3 znaki specjalne.";
    if (password !== confirmPassword) newErrors.confirmPassword = "Hasła muszą się zgadzać.";

    const ageValue = parseInt(age);
    if (isNaN(ageValue) || ageValue < 18 || ageValue > 99) newErrors.age = "Wiek musi być liczbą od 18 do 99.";

    const birthYear = new Date(birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    if (currentYear - birthYear !== ageValue) newErrors.birthDate = "Data urodzenia musi być zgodna z wiekiem.";

    if (!country) newErrors.country = "Musisz wybrać kraj.";

    if (!termsConsent) newErrors.termsConsent = "Musisz zaakceptować regulamin.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Formularz poprawny:", formData);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <FormField>
          <Label>Imię:</Label>
          <Input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
        </FormField>

        <FormField>
          <Label>Nazwisko:</Label>
          <Input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
        </FormField>

        <FormField>
          <Label>Email:</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </FormField>

        <FormField>
          <Label>Hasło:</Label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        </FormField>

        <FormField>
          <Label>Potwierdź hasło:</Label>
          <Input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
        </FormField>

        <FormField>
          <Label>Wiek:</Label>
          <Input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
          {errors.age && <ErrorMessage>{errors.age}</ErrorMessage>}
        </FormField>

        <FormField>
          <Label>Data urodzenia:</Label>
          <Input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
          />
          {errors.birthDate && <ErrorMessage>{errors.birthDate}</ErrorMessage>}
        </FormField>

        <FormField>
          <Label>Kraj:</Label>
          <Select name="country" value={formData.country} onChange={handleChange}>
            <option value="">Wybierz kraj</option>
            {countries.map((country) => (
              <option key={country.name} value={country.name}>
                {country.name} {country.flag && <img src={country.flag} alt="flag" width="20" />}
              </option>
            ))}
          </Select>
          {errors.country && <ErrorMessage>{errors.country}</ErrorMessage>}
        </FormField>

        <FormField>
          <Label>Płeć (opcjonalnie):</Label>
          <Select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Wybierz płeć</option>
            <option value="male">Mężczyzna</option>
            <option value="female">Kobieta</option>
            <option value="other">Inne</option>
          </Select>
        </FormField>

        <FormField>
          <Input
            type="checkbox"
            name="marketingConsent"
            checked={formData.marketingConsent}
            onChange={handleChange}
          />
          <Label>Zgody marketingowe (opcjonalnie)</Label>
        </FormField>

        <FormField>
          <Input
            type="checkbox"
            name="termsConsent"
            checked={formData.termsConsent}
            onChange={handleChange}
          />
          <Label>Zgoda na regulamin (wymagane)</Label>
          {errors.termsConsent && <ErrorMessage>{errors.termsConsent}</ErrorMessage>}
        </FormField>

        <Button type="submit">Zarejestruj się</Button>
      </form>
    </FormContainer>
  );
};

export default RegistrationForm;
