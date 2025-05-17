              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg flex items-center transition"
            disabled={isSubmitting}
          >
            <FiSave className="mr-2" />
            {isSubmitting ? 'Salvando...' : 'Salvar Treino'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewWorkoutPage;
